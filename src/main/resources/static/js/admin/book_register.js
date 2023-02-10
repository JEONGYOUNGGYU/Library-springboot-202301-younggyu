window.onload = () => {
    BookRegisterService.getInstance().loadCategories();

    ComponentEvent.getInstance().addClickEventRegisterButton();
    ComponentEvent.getInstance().addClickEventImgAddButton();
    ComponentEvent.getInstance().addChangeEventImgFile();
    ComponentEvent.getInstance().addClickEventImgRegisterButton();
    ComponentEvent.getInstance().addClickEventImgCancelButton();
}

const bookObj = {
    bookCode: "",
    bookName: "",
    publisher: "",
    publicationDate: "",
    category: ""    
}

const fileObj = {
    files: new Array(),
    formData: new FormData()
}

class BookRegisterApi {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null){
            this.#instance = new BookRegisterApi();     // 생성자랑 클래스명 일치시켜줘야한다.
        }
        return this.#instance;
    }

    registerBook() {
        let successFlag = false;

        $.ajax({
            async: false,
            type: "post",
            url: "http://localhost:8000/api/admin/book",
            contentType: "application/json",
            data: JSON.stringify(bookObj),
            dataType: "json",
            success: response => {
                successFlag = true;
            },
            error: error => {
                console.log(error);
                BookRegisterService.getInstance().setErrors(error.responseJSON.data);
                
            }
        });

        return successFlag;
    }
    registerImg() {
        $.ajax({
            async: false,
            type: "post",   // multipart는 무조건 post
            url: `http://localhost:8000/api/admin/book/${bookObj.bookCode}/images`,
            encType: "multipart/form-data", // 요청을 form-data로 통째로 날릴 때 사용 multipart/form-data 는 encType,contentType,processData 이 세가지 필수
            contentType: false,
            processData: false,
            data: fileObj.formData,
            dataType: "json",
            success: response => { // 이미지 등록 성공 했으면
                alert("도서 이미지 등록 완료.");
                location.reload();
            },
            error: error => {
                console.log(error);
            }
        })
    }

    getCategories() {
        let responseData = null;
        
        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/admin/categories",
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


class BookRegisterService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null){
            this.#instance = new BookRegisterService();
        }
        return this.#instance;
    }

    setBookObjValues() {
        const registerInputs = document.querySelectorAll(".register-input");
    
        bookObj.bookCode = registerInputs[0].value;
        bookObj.bookName = registerInputs[1].value;
        bookObj.author = registerInputs[2].value;
        bookObj.publisher = registerInputs[3].value;
        bookObj.publicationDate = registerInputs[4].value;
        bookObj.category = registerInputs[5].value;
    }

    loadCategories() {
        const responseData = BookRegisterApi.getInstance().getCategories();

        const categorySelect = document.querySelector(".category-select");
        categorySelect.innerHTML = `<option value="">전체조회</option>`;
    
        responseData.forEach(data => {
            categorySelect.innerHTML += `
                <option value="${data.category}">${data.category}</option>
            `;
        });    
    }
    
    setErrors(errors) {  
        const errorMessages = document.querySelectorAll(".error-message")
        this.clearErrors();

        Object.keys(errors).forEach(key => {
            if(key == "bookCode") {
                errorMessages[0].innerHTML = errors[key];
            }else if(key == "bookName") {
                errorMessages[1].innerHTML = errors[key];
            }else if(key == "category") {
                errorMessages[5].innerHTML = errors[key];
            }
        })
    }
    clearErrors() {
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach(error => {
            error.innerHTML = "";
        })
    }

}

class ImgFileService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null){
            this.#instance = new ImgFileService();
        }
        return this.#instance;
    }

    getImgPreview() {
        const bookImg = document.querySelector(".book-img");

        const reader = new FileReader();        // 1번

        reader.onload = (e) => {                // 얘가 실행 / 3번 순서
            bookImg.src = e.target.result;      // 실제 결과를 가지고 와서 src가 바뀐다.
        }

        reader.readAsDataURL(fileObj.files[0]); // 이 메소드가 호출되면 2번

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

    addClickEventRegisterButton() {     // 등록하기 클릭을 했을 때
        const registerButton = document.querySelector(".register-button");
        
        registerButton.onclick = () => {
            BookRegisterService.getInstance().setBookObjValues();
            const successFlag = BookRegisterApi.getInstance().registerBook();

            if(!successFlag) {  // true가 아니면은
                return;
            }


            if(confirm("도서 이미지를 등록하시겠습니까?")) {
                const imgAddButton = document.querySelector(".img-add-button");
                const imgCancelButton = document.querySelector(".img-cancel-button");
            
               imgAddButton.disabled = false;
               imgCancelButton.disabled = false;
            }
            else {
                location.reload();  // 새로고침
            }
        }


    }


    addClickEventImgAddButton() {
        const imgFile = document.querySelector(".img-file");
        const addButton = document.querySelector(".img-add-button");
    
        addButton.onclick = () => {
            imgFile.click();
        }
    }

    addChangeEventImgFile() {       // 이미지를 바꿨을 시점
        const imgFile = document.querySelector(".img-file");

        imgFile.onchange = () => {
            const formData = new FormData(document.querySelector(".img-form"));
            let changeFlag = false; // 취소하면 새로고침 되는것

            fileObj.files.pop()  // 이전에 들어있던거 비우고 다시 채움 

            formData.forEach(value => {
                console.log(value);         // value는 이미지 객체

                if(value.size != 0) {
                    fileObj.files.push(value);
                    changeFlag = true;
                }
            });

            if(changeFlag) {
                const imgRegisterButton = document.querySelector(".img-register-button");
                imgRegisterButton.disabled = false;
                
                
                ImgFileService.getInstance().getImgPreview();
                imgFile.value = null;
            }
        
        }


    }
    // 이미지 등록버튼
    addClickEventImgRegisterButton() {
        const imgRegisterButton = document.querySelector(".img-register-button");

        imgRegisterButton.onclick = () => {
            fileObj.formData.append("files", fileObj.files[0]);
            BookRegisterApi.getInstance().registerImg();

        }
    }

    addClickEventImgCancelButton() {
        const imgCancelButton = document.querySelector(".img-cancel-button");

        imgCancelButton.onclick = () => {
            if(confirm("정말로 이미지 등록을 취소하시겠습니까?")) {
                location.reload(); // reload는 새로고침
            }
        }
    }
}