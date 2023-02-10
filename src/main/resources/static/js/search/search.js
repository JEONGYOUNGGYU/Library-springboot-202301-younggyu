window.onload = () => {
    HeaderService.getInstance().loadHeader();
    // console.log(SearchApi.getInstance().getTotalCount());
    // console.log(SearchApi.getInstance().searchBook());
    SearchService.getInstance().clearBookList();
    SearchService.getInstance().loadSearchBooks();
    SearchService.getInstance().loadCategories();
    SearchService.getInstance().setMaxPage();
    
    
    ComponentEvent.getInstance().addClickEventCategoryCheckboxs();
    ComponentEvent.getInstance().addScrollEventPaging();
    ComponentEvent.getInstance().addClickEventSearchButton();
    
    SearchService.getInstance().onLoadSearch();
}

let maxPage = 0;

// 검색을 할 때 사용할 Obj
const searchObj = {
    page: 1,
    searchValue: null,
    categories: new Array(),    // 배열
    count: 10                   // 10개씩 불러오기

}


class SearchApi {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new SearchApi();
        }
        return this.#instance;
    }



    getCategories() {
        let returnData = null;

        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/admin/categories",
            dataType: "json",
            success: response => { //CMResp의 데이터가 response.data로 들어온다
                console.log(response);
                returnData = response.data;
            },
            error: error => {
                console.log(error);
            }
        });

        return returnData;
    }

    getTotalCount(){
        let responseData = null;
        
        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/search/totalcount",
            data: searchObj,
            dataType: "json",
            success: response => {
                responseData = response.data;
            },
            error: error => {
                console.log(error);
            }
        })

        return responseData;
    }

    searchBook() {
        let responseData = null;
        
        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/search",
            data: searchObj,
            dataType: "json",
            success: response => {
                responseData = response.data;
            },
            error: error => {
                console.log(error);
            }
        })

        return responseData;
    }

    // 좋아요 클릭
    setLike(bookId) {
        let likeCount = -1;

        $.ajax({
            async: false,
            type: "post",
            url: `http://localhost:8000/api/book/${bookId}/like`,
            dataType: "json",
            success: response => {
                likeCount = response.data;
            },
            error: error => {
                console.log(error);
            }
        });

        return likeCount;
    }

    // 좋아요 취소
    setDisLike(bookId) {
        let likeCount = -1;

        $.ajax({
            async: false,
            type: "delete",
            url: `http://localhost:8000/api/book/${bookId}/like`,
            dataType: "json",
            success: response => {
                likeCount = response.data;
            },
            error: error => {
                console.log(error);
            }
        });

        return likeCount;
    }

    // 책 대여하기 
    rentalBook(bookId) {
        let responseData = 0;

        $.ajax({
            async: false,
            type: "post",
            url: `http://localhost:8000/api/rental/${bookId}`,
            dataType: "json",
            success: response => {
                responseData = response.data;
            },
            error: error => {
                console.log(error);
                alert(error.responseJSON.data.rentalCountError);
            }
        });

        return responseData;
    }

    // 책 반납하기
    returnBook(bookId) {
        let responseData = false;

        $.ajax({
            async: false,
            type: "put",
            url: `http://localhost:8000/api/rental/${bookId}`,
            dataType: "json",
            success: response => {
                responseData = response.data;
            },
            error: error => {
                console.log(error);
                
            }
        });

        return responseData;
    }
}



class SearchService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new SearchService();
        }
        return this.#instance;
    }


    onLoadSearch() {
        const URLSearch = new URLSearchParams(location.search);
        
        if(URLSearch.has("searchValue")){   // 만약에 URLSearch가 searchValue를 가지고 있으면
            const searchValue = URLSearch.get("searchValue");
            if(searchValue == ""){
                return;
            }

            const searchInput = document.querySelector(".search-input");
            searchInput.value = searchValue;
            const searchButton = document.querySelector(".search-button");
            searchButton.click();
        }
    }

    // 카테고리 생성
    loadCategories() {
        const categoryList = document.querySelector(".category-list");
        categoryList.innerHTML = ``;

        const responseData = SearchApi.getInstance().getCategories()
        responseData.forEach(categoryObj => {
            categoryList.innerHTML += `
                <div class="category-item">
                    <input type="checkbox" class="category-checkbox" id="${categoryObj.category}" value="${categoryObj.category}">   <!-- id랑 --!>
                    <label for="${categoryObj.category}">${categoryObj.category}</label>                                             <!-- for랑 값이 같아야 한다 --!>
                </div>
            
                `;
        });

    }

    clearBookList() {
        const contentFlex = document.querySelector(".content-flex");
        contentFlex.innerHTML = "";
    }

    setMaxPage() {
        const totalCount = SearchApi.getInstance().getTotalCount();
        maxPage = totalCount % 10 == 0 ? totalCount / 10 : Math.floor(totalCount / 10) + 1;
    }

    // 책 불러오기
    loadSearchBooks() {
        const responseData = SearchApi.getInstance().searchBook();
        const contentFlex = document.querySelector(".content-flex");
        const principal = PrincipalApi.getInstance().getPrincipal();

        const _bookButtons = document.querySelectorAll(".book-buttons");
        const bookButtonsLength = _bookButtons == null ? 0 : _bookButtons.length;

        console.log(responseData)

        responseData.forEach((data, index) => {
            contentFlex.innerHTML += `
                <div class="info-container">
                            <div class="book-desc">
                                <div class="img-container">
                                    <img src="http://localhost:8000/image/book/${data.saveName != null ? data.saveName : "no_img.png"}" class="book-img">
                                </div>
                                <div class="like-info"><i class="fa-regular fa-thumbs-up"><span class="like-count">${data.likeCount != null ? data.likeCount : 0}</span></i></div>
                            </div>

                            <div class="book-info">
                                <input type="hidden" class="book-id" value="${data.bookId}">
                                <h3 class="book-code">${data.bookName}</h3>
                                <div class="book-name">${data.bookCode}</div>
                                <div class="info-text book-author"><b>저자: </b>${data.author}</div>
                                <div class="info-text book-publisher"><b>출판사: </b>${data.publisher}</div>
                                <div class="info-text book-publicationdate"><b>출판일: </b>${data.publicationDate}</div>
                                <div class="info-text book-category"><b>카테고리: </b>${data.category}</div>
                                <div class="book-buttons">
                                    
                                    
                                </div>
                            </div>
                        </div> 
                `;
                const bookButtons = document.querySelectorAll(".book-buttons");
                if(principal == null) {
                    if(data.rentalDtlId != 0 && data.returnDate == null){
                        bookButtons[bookButtonsLength + index].innerHTML = `
                            <button type="button" class="rental-button" disabled>대여중</button>
                        `;
                    }
                    else {
                        bookButtons[bookButtonsLength + index].innerHTML = `
                            <button type="button" class="rental-button" disabled>대여가능</button>
                        `;
                    }
                
            
                bookButtons[bookButtonsLength + index].innerHTML += `
                    <button type="button" class="like-button" disabled>추천</button>
                `;
        }
        else {
            if(data.rentalDtlId != 0 && data.returnDate == null && data.userId != principal.user.userId) {
                bookButtons[bookButtonsLength + index].innerHTML = `
                    <button type="button" class="rental-buttons rental-button" disabled>대여중</button>
                `;
            }
            else if(data.rentalDtlId != 0 && data.returnDate == null && data.userId == principal.user.userId) {
                bookButtons[bookButtonsLength + index].innerHTML = `
                    <button type="button" class="rental-buttons return-button">반납하기</button>
                `;
            }
            else {
                bookButtons[bookButtonsLength + index].innerHTML = `
                    <button type="button" class="rental-buttons rental-button">대여하기</button>
                `;
            }
            if(data.likeId != 0 ) {
                bookButtons[bookButtonsLength + index].innerHTML += `
                    <button type="button" class="like-buttons dislike-button">추천취소</button>
                 `;

            }
            else { 
                bookButtons[bookButtonsLength + index].innerHTML += `
                    <button type="button" class="like-buttons like-button">추천</button>
                 `;
                }

                ComponentEvent.getInstance().addClickEventRentalButtons();
                ComponentEvent.getInstance().addClickEventLikeButtons();
            }
        });
    }
}

class ComponentEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new ComponentEvent();
        }
        return this.#instance;
    }
    
    // 카테고리 체크박스를 클릭할 때
    addClickEventCategoryCheckboxs() {
        const checkboxs = document.querySelectorAll(".category-checkbox");

        checkboxs.forEach(checkbox => {
            checkbox.onclick = () => {
                if(checkbox.checked) {
                    searchObj.categories.push(checkbox.value);  //value 값을 넣어준다 ex> 소설, 경영 등등..
                }else {
                    const index = searchObj.categories.indexOf(checkbox.value);  // indexOf = 해당 값의 위치를 찾아내주는 역할
                    searchObj.categories.splice(index, 1);                       // splice(index, 1) 0번 인덱스부터 1개 지워라
                }
                // console.log(searchObj.categories);
                document.querySelector(".search-button").click();
            }
        });
        
    }

    // 마우스 스크롤 내릴 때
    addScrollEventPaging() {
        const html = document.querySelector("html");
        const body = document.querySelector("body");

        body.onscroll = () => {
            const scrollPosition = body.offsetHeight - html.clientHeight - html.scrollTop;

            if(scrollPosition < 250 && searchObj.page < maxPage) {
                searchObj.page++;
                SearchService.getInstance().loadSearchBooks();

            }

            // console.log("HTML CLIENT: " + html.clientHeight);
            // console.log("body offset: " + body.offsetHeight);
            // console.log("client - offset - scrollTop " + (body.offsetHeight - html.clientHeight - html.scrollTop));
            // console.log("html scrollTop: " + html.scrollTop);
        }
    }
    
    // 검색버튼기능
    addClickEventSearchButton() {
        const searchButton = document.querySelector('.search-button');
        const searchInput = document.querySelector(".search-input");
        
        searchButton.onclick = () => {
            searchObj.searchValue = searchInput.value;
            searchObj.page = 1;
            window.scrollTo(0, 0);  // 페이지 제일 위로 올라감
            SearchService.getInstance().clearBookList();
            SearchService.getInstance().setMaxPage();
            SearchService.getInstance().loadSearchBooks();
        }
    
        searchInput.onkeyup = () => {               // onkeyup은 키보드 중 아무거나 누르고 땔 때
            if(window.event.keyCode == 13) {        // keyCode는 키보드 중 아무거나 클릭하는 것. 키보드 하나하나에 코드가 있는데 13은 엔터칠 때를 말한다.
                // console.log("keyCode = " + keyCode)
                searchButton.click();
            }
        }
    }
    // 좋아요버튼
    addClickEventLikeButtons() {
        const likeButtons = document.querySelectorAll(".like-buttons");
        const bookIds = document.querySelectorAll(".book-id");
        const likeCounts = document.querySelectorAll(".like-count");

        likeButtons.forEach((button, index) => {
            button.onclick = () => {
                if(button.classList.contains("like-button")) {
                    const likeCount = SearchApi.getInstance().setLike(bookIds[index].value);
                    if(likeCount != -1){
                        button.classList.remove("like-button");
                        button.classList.add("dislike-button");
                        button.textContent = "추천취소";
                    }
                }
                else {
                    const likeCount = SearchApi.getInstance().setDisLike(bookIds[index].value);
                    if(likeCount != -1){
                        button.classList.remove("dislike-button");
                        button.classList.add("like-button");
                        button.textContent = "추천";
                    }
                    
                }

            }
        });
    }

    // 대여하기 버튼
    addClickEventRentalButtons() {
        const rentalButtons = document.querySelectorAll(".rental-buttons");
        const bookIds = document.querySelectorAll(".book-id");

        rentalButtons.forEach((button, index) => {
            button.onclick = () => {
                if(button.classList.contains("rental-button") && button.disabled == false) {    // disabled가 false고 rental-button을 가지고 있는 것 = 대여중
                    const flag = SearchApi.getInstance().rentalBook(bookIds[index].value);

                    if(flag){    // -1이면 실패했다고 보면 된다
                        button.classList.remove("rental-button");
                        button.classList.add("return-button");
                        button.textContent = "반납하기";
                    }
                    
                }
                else if(button.classList.contains("return-button")){
                    const flag = SearchApi.getInstance().returnBook(bookIds[index].value);
                    if(flag) {   // -1이면 실패했다고 보면 된다
                        button.classList.remove("return-button");
                        button.classList.add("rental-button");
                        button.textContent = "대여하기";
                    }
                }
            }
        })
    }
}

