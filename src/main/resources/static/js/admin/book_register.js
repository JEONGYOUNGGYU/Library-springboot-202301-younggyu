window.onload = () => {
    ComponentEvent.getInstance().addClickEventRegisterButton();

    ComponentEvent.getInstance().addClickEventImgAddButton();
    ComponentEvent.getInstance().addChangeEventImgFile();
}
const fileObj = {
    files: new Array()
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
            if(confirm("도서 이미지를 등록하시겠습니까?")) {
                const imgAddButton = document.querySelector(".img-add-button");
                const imgRegisterButton = document.querySelector(".img-register-button");
            
               imgAddButton.disabled = false;
               imgRegisterButton.disabled = false;
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
            let changeFlag = false;

            fileObj.files.pop()  // 이전에 들어있던거 비우고 다시 채움 

            formData.forEach(value => {
                console.log(value);         // value는 이미지 객체

                if(value.size != 0) {
                    fileObj.files.push(value);
                    changeFlag = true;
                }
            });

            if(changeFlag) {
                ImgFileService.getInstance().getImgPreview();
                imgFile.value = null;
            }
        
        }


    }
}