window.onload = () => {
    BookModificationService.getInstance().setBookCode();
    BookModificationService.getInstance().loadCategories();
    BookModificationService.getInstance().loadBookAndImageData();


    ComponentEvent.getInstance().addClickEventModificationButton();
    ComponentEvent.getInstance().addClickEventImgAddButton();
    ComponentEvent.getInstance().addChangeEventImgFile();
    ComponentEvent.getInstance().addClickEventImgModificationButton();
    ComponentEvent.getInstance().addClickEventImgCancelButton();
}

const bookObj = {
    bookCode: "",
    bookName: "",
    publisher: "",
    publicationDate: "",
    category: ""    
}

const imgObj = {
    imageId: null,
    bookCode: null,
    saveName: null,
    originName: null
}


const fileObj = {
    files: new Array(),
    formData: new FormData()
}


class BookModificationApi {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null){
            this.#instance = new BookModificationApi();     // 생성자랑 클래스명 일치시켜줘야한다.
        }
        return this.#instance;
    }
    
    
    getBookAndImage() {
        let responseData = null;

        $.ajax ({
            async: false,
            type: "get",
            url: `http://127.0.0.1:8000/api/admin/book/${bookObj.bookCode}`,
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

    getCategories() {
        let responseData = null;
        
        $.ajax({
            async: false,
            type: "get",
            url: "http://127.0.0.1:8000/api/admin/categories",
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

    modifyBook() {
        let successFlag = false;
        
        $.ajax ({
            async: false,
            type: "put",
            url: `http://127.0.0.1:8000/api/admin/book/${bookObj.bookCode}`,
            contentType: "application/json",
            data: JSON.stringify(bookObj),
            dataType: "json",
            success: response => {
                successFlag = true;
            },
            error: error => {
                console.log(error);
                BookModificationService.getInstance().setErrors(error.responseJSON.data);
            }
        });
        return successFlag;
    }


    removeImg() {
        let successFlag = false;
        $.ajax({
            async: false,
            type: "delete",
            url: `http://127.0.0.1:8000/api/admin/book/${bookObj.bookCode}/image/${imgObj.imageId}`,
            dataType: "json",
            success: response => {
                successFlag = true;
            },
            error: error => {
                console.log(error);
            }
        });
    }

    registerImg() {
        $.ajax({
            async: false,
            type: "post",   // multipart는 무조건 post
            url: `http://127.0.0.1:8000/api/admin/book/${bookObj.bookCode}/images`,
            encType: "multipart/form-data", // 요청을 form-data로 통째로 날릴 때 사용 multipart/form-data 는 encType,contentType,processData 이 세가지 필수
            contentType: false,
            processData: false,
            data: fileObj.formData,
            dataType: "json",
            success: response => { // 이미지 등록 성공 했으면
                alert("도서 이미지 수정완료.");
                location.reload();
            },
            error: error => {
                console.log(error);
            }
        })
    }

}


class BookModificationService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null){
            this.#instance = new BookModificationService();
        }
        return this.#instance;
    }

    setBookCode() {
        // console.log(location.search);
        const URLSearch = new URLSearchParams(location.search);
        // console.log(URLSearch.get("bookCode"));
        bookObj.bookCode = URLSearch.get("bookCode");
    }

    setBookObjValues() {
        const modificationInputs = document.querySelectorAll(".modification-input");
    
        bookObj.bookCode = modificationInputs[0].value;
        bookObj.bookName = modificationInputs[1].value;
        bookObj.author = modificationInputs[2].value;
        bookObj.publisher = modificationInputs[3].value;
        bookObj.publicationDate = modificationInputs[4].value;
        bookObj.category = modificationInputs[5].value;
    }

    loadBookAndImageData() {
        const responseData = BookModificationApi.getInstance().getBookAndImage();
        console.log(responseData);
        
        if(responseData.bookMst == null){   //bookMst가 null이면 등록되지 않은 코드
            alert("해당 도서코드는 등록되지 않은 코드입니다.");
            history.back(); // 뒤로가기
            return;
        }

        const modificationInputs = document.querySelectorAll(".modification-input");
        modificationInputs[0].value = responseData.bookMst.bookCode;
        modificationInputs[1].value = responseData.bookMst.bookName;
        modificationInputs[2].value = responseData.bookMst.author;
        modificationInputs[3].value = responseData.bookMst.publisher;
        modificationInputs[4].value = responseData.bookMst.publicationDate;
        modificationInputs[5].value = responseData.bookMst.category;

        if(responseData.bookImage != null){
            imgObj.imageId = responseData.bookImage.imageId;
            imgObj.bookCode = responseData.bookImage.bookCode;
            imgObj.saveName = responseData.bookImage.saveName;
            imgObj.originName = responseData.bookImage.originName;


            const bookImg = document.querySelector(".book-img");
            bookImg.src = `http://127.0.0.1:8000/image/book/${responseData.bookImage.saveName}`;
   
    }
}

    loadCategories() {
        const responseData = BookModificationApi.getInstance().getCategories();

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

    addClickEventModificationButton() {     // 등록하기 클릭을 했을 때
        const modificationButton = document.querySelector(".modification-button");
        
        modificationButton.onclick = () => {
            BookModificationService.getInstance().setBookObjValues();
            const successFlag = BookModificationApi.getInstance().modifyBook();

            if(!successFlag) {  // true가 아니면은
                return;
            }

            BookModificationService.getInstance().clearErrors();    // 성공했을 때 에러 클리어


            if(confirm("도서 이미지를 수정하시겠습니까?")) {
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
                const imgModificationButton = document.querySelector(".img-modification-button");
                imgModificationButton.disabled = false;
                
                
                ImgFileService.getInstance().getImgPreview();
                imgFile.value = null;
            }
        
        }


    }
    // 이미지 등록버튼
    addClickEventImgModificationButton() {
        const imgModificationButton = document.querySelector(".img-modification-button");

        imgModificationButton.onclick = () => {
            fileObj.formData.append("files", fileObj.files[0]);

            let successFlag = true;

            if(imgObj.imageId != null) {
                successFlag = BookModificationApi.getInstance().removeImg();
            }

            if(successFlag) {
                BookModificationApi.getInstance().registerImg();
            }

        }
    }

    addClickEventImgCancelButton() {
        const imgCancelButton = document.querySelector(".img-cancel-button");

        imgCancelButton.onclick = () => {
            if(confirm("정말로 이미지 수정을 취소하시겠습니까?")) {
                location.reload(); // reload는 새로고침
            }
        }
    }
}