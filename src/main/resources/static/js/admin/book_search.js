window.onload = () => {
    BookService.getInstance().loadBookList();
    BookService.getInstance().loadCategories();
    ComponentEvent.getInstance().addClickEventSearchButton();
    ComponentEvent.getInstance().addClickEventDeleteButton();
    ComponentEvent.getInstance().addClickEventDeleteCheckAll();
    

}

let searchObj = {
    page : 1,
    category : "",
    searchValue : "",
    order : "bookId",
    limit : "Y",
    count : 20
}

class BookSearchApi {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null){
            this.#instance = new BookSearchApi();
        }
        return this.#instance;
    }

    getBookList(searchObj) {
        let returnData = null;

        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/admin/books",
            data: searchObj,
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


    getBookTotalCount(searchObj) {
        let returnData = null;

        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/admin/books/totalcount",
            data: {
                "category" : searchObj.category,
                "searchValue" : searchObj.searchValue
            },
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

    deleteBooks(deleteArray) {
        let returnFlag = false;

        $.ajax({
            async: false,
            type: "delete",
            url: "http://localhost:8000/api/admin/books",
            contentType: "application/json",
            data: JSON.stringify(   // json으로 바꿈 userIds: deleteArray를
                {
                    userIds: deleteArray
                }
            ),
            dataType: "json",
            success: response => {
                returnFlag = true;
            },
            error: error => {
                console.log(error);

            }
        })

        return returnFlag;
    }
}

class BookService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null){
            this.#instance = new BookService();
        }
        return this.#instance;
    }

    loadBookList() {
        const responseData = BookSearchApi.getInstance().getBookList(searchObj);
        // 페이지 넘어갔을 때 check가 풀리는 거
        const checkAll = document.querySelector(".delete-checkall");
        checkAll.checked = false;


        const bookListBody = document.querySelector(".content-table tbody")
        bookListBody.innerHTML = "";

        responseData.forEach((data, index) => {
            bookListBody.innerHTML += `
                <tr>
                    <td><INPUT type="checkbox" class="delete-checkbox"></INPUT></td>
                    <td class="book-id">${data.bookId}</td>
                    <td>${data.bookCode}</td>
                    <td>${data.bookName}</td>
                    <td>${data.author}</td>
                    <td>${data.publisher}</td>
                    <td>${data.publicationDate}</td>
                    <td>${data.category}</td>
                    <td>${data.rentalStatus == "Y" ? "대여중" : "대여가능"}</td>
                    <td><a href="/templates/admin/book_modification.html?bookCode=${data.bookCode}"><i class="fa-solid fa-square-pen"></i></a></td>
                </tr>
            `;
        });
        this.loadSearchNumberList();
        ComponentEvent.getInstance().addClickEventDeleteCheckbox();
    }

    loadSearchNumberList() {
        const pageController = document.querySelector(".page-controller");
        
        const totalCount = BookSearchApi.getInstance().getBookTotalCount(searchObj);
        const maxPageNumber = totalCount % searchObj.count == 0 
                            ? Math.floor(totalCount / searchObj.count)
                            : Math.floor(totalCount / searchObj.count) + 1
                          // Math.floor는 소수점 단위 없앰 
      
   

        pageController.innerHTML = `
            <a href="javascript:void(0)" class="pre-button disabled">이전</a>
            <ul class="page-numbers">
               
            </ul>
            <a href="javascript:void(0)" class="next-button disabled">다음</a>
        `;
        
        // page 번호가 1이 아닐때 이전 버튼 동작가능하게 만드는 법
        if(searchObj.page != 1){
            const preButton = pageController.querySelector(".pre-button");
            preButton.classList.remove("disabled");

            preButton.onclick = () => {
                searchObj.page--;
                this.loadBookList();

            }
        }
        
         if(searchObj.page != maxPageNumber){
            const nextButton = pageController.querySelector(".next-button");
            nextButton.classList.remove("disabled");

            nextButton.onclick = () => {
                searchObj.page++;
                this.loadBookList();
            }
        }
        const startIndex = searchObj.page % 5 == 0
                    ? searchObj.page - 4
                    : searchObj.page - (searchObj.page % 5) + 1;

        const endIndex = startIndex + 4 <= maxPageNumber ? startIndex + 4 : maxPageNumber;
        const pageNumbers = document.querySelector(".page-numbers");


        for(let i = startIndex; i <= endIndex; i++){
            pageNumbers.innerHTML += `
                <a href="javascript:void(0)" class="page-button ${i == searchObj.page ? "disabled" : ""}"><li>${i}</li></a>
            `;
        }

        // 페이지 번호를 눌렀을 때 값을 가져오는 방법
        const pageButtons = document.querySelectorAll(".page-button");
        pageButtons.forEach(button => {

            const pageNumber = button.textContent; // 1번을 눌렀을 때 1페이지 값 출력 
            if(pageNumber != searchObj.page) {
                button.onclick = () => {
                    searchObj.page = pageNumber;
                    this.loadBookList();
                }
            }
        });
    
    }

    loadCategories() {
        const responseData = BookSearchApi.getInstance().getCategories();

        const categorySelect = document.querySelector(".category-select");
        categorySelect.innerHTML = `<option value="">전체조회</option>`;
    
        responseData.forEach(data => {
            categorySelect.innerHTML += `
                <option value="${data.category}">${data.category}</option>
            `;
        });
        
    }
    removeBooks(deleteArray) {
        let successFlag = BookSearchApi.getInstance().deleteBooks(deleteArray);
        if(successFlag) {
            searchObj.page = 1;
            this.loadBookList();
        }
            
   }
}

class ComponentEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null){
            this.#instance = new ComponentEvent();
        }
        return this.#instance;
    }


    addClickEventSearchButton(){
        const categorySelect = document.querySelector(".category-select")
        const searchInput = document.querySelector(".search-input");
        const searchButton = document.querySelector(".search-button");

        searchButton.onclick = () => {
            searchObj.category = categorySelect.value;
            searchObj.searchValue = searchInput.value;
            searchObj.page = 1;
            BookService.getInstance().loadBookList();   // bookservice 안에 있는 loadbooklist()를 호출하면...
        }

        searchInput.onkeyup = () => {
            if(window.event.keyCode == 13) {
                searchButton.click();
            }
        }
    }
    
    addClickEventDeleteButton() {
        const deleteButton = document.querySelector(".delete-button");
        deleteButton.onclick = () => {
            if(confirm("정말로 삭제하시겠습니까?")) {   //true 일때 밑에 동작
                const deleteArray = new Array();
    
    
                const deleteCheckboxs = document.querySelectorAll(".delete-checkbox");
                deleteCheckboxs.forEach((deleteCheckbox, index) =>{
                    if(deleteCheckbox.checked){ // 만약에 checked가 true이면(되어있으면) 
                        // console.log(deleteCheckbox.checked + ": index -> " + index);
                            const bookIds = document.querySelectorAll(".book-id");
                            // console.log("bookId: " + bookIds[index].textContent);
                            deleteArray.push(bookIds[index].textContent);
                    }
                });
    
                BookService.getInstance().removeBooks(deleteArray);

            }
        }
    }
    addClickEventDeleteCheckAll() {
        const checkAll = document.querySelector(".delete-checkall");

        checkAll.onclick = () => {
            const deleteCheckboxs = document.querySelectorAll(".delete-checkbox");
            deleteCheckboxs.forEach(deleteCheckbox => {
                deleteCheckbox.checked = checkAll.checked;
            });
        }
    }

        addClickEventDeleteCheckbox() {
            const deleteCheckboxs = document.querySelectorAll(".delete-checkbox");
            
            const checkAll = document.querySelector(".delete-checkall");
            
            deleteCheckboxs.forEach(deleteCheckbox => {
                deleteCheckbox.onclick = () => {
                    const deleteCheckedCheckboxs = document.querySelectorAll(".delete-checkbox:checked");
                    console.log("선택:" + deleteCheckedCheckboxs.length);
                    console.log("전체:" + deleteCheckboxs.length);
                    if(deleteCheckedCheckboxs.length == deleteCheckboxs.length) {
                        checkAll.checked = true;
                    }
                    else {
                        checkAll.checked = false;
                    }
                }
            });
        }
    }


