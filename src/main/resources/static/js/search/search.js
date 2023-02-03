window.onload = () => {
    SearchService.getInstance().loadCategories();
    
    ComponentEvent.getInstance().addClickEventCategoryCheckboxs();


}


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
            url: "http://127.0.0.1:8000/api/admin/categories",
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

}

class SearchService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new SearchService();
        }
        return this.#instance;
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
                console.log(searchObj.categories);
            }
        });
        
    }
    
}

