// ==UserScript==
// @name         MULA by @felxcoder
// @namespace    http://tampermonkey.net/
// @version      2024-10-04
// @description  Creator : @felxcoder
// @author       @felxcoder
// @match        https://esatis.uyap.gov.tr/main/jsp/esatis/index.jsp?menuId=*&kayitId=*
// @icon         https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e7/Diamond_Pickaxe_JE3_BE3.png/revision/latest/scale-to-width/360?cb=20200226193952
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    let lastRequestData = null;
    let endTime = null;

    let lastOffer = null
    let ourOffer = null

    let mulaRUN = false
    let mulaOFFER = false

    let mulalpMaxOffer_u = null
    let mulalpAdd_u = null
    let mulalpSecond_u = null
    let mulalpMilisecond_u = null

    // -------------------------------------------------------------------------------------------------


    XMLHttpRequest.prototype.open = function (method, url) {
        this._method = method;
        this._url = url;
        originalOpen.apply(this, arguments);
    };


    XMLHttpRequest.prototype.send = function (body) {

        originalSend.apply(this, arguments);


        this.addEventListener('load', () => {
            if (this._method.toUpperCase() === 'POST' && this._url.includes('ihale_detay_bilgileri_brd.ajx')) {

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(this.responseText, "text/xml");

                const ihaleBitisZamani = xmlDoc.getElementsByTagName("ihaleBitisZamani")[0].textContent;
                const sonTeklifIDB = xmlDoc.getElementsByTagName("sonTeklif")[0].textContent;

                lastOffer = Number(sonTeklifIDB)
                endTime = new Date(ihaleBitisZamani)

                lastRequestData = body;

                console.log("LAST OFFER : " + lastOffer)

                secTimer()

            }

            if (this._method.toUpperCase() === 'POST' && this._url.includes('ihale_detay_bilgileri_ozet_brd.ajx')) {

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(this.responseText, "text/xml");

                const ihaleBitisZamani = xmlDoc.getElementsByTagName("ihaleBitisZamani")[0].textContent;
                const sonTeklifIDBO = xmlDoc.getElementsByTagName("sonTeklif")[0].textContent;

                lastOffer = Number(sonTeklifIDBO)
                endTime = new Date(ihaleBitisZamani)

                console.log("LAST OFFER : " + lastOffer)


                if (mulaOFFER && ourOffer < lastOffer && lastOffer + mulalpAdd_u <= mulalpMaxOffer_u) {
                    ourOffer = lastOffer + mulalpAdd_u

                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'https://esatis.uyap.gov.tr/main/jsp/esatis/ihaleTeklifIslemleri_brd.ajx', true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send(`${lastRequestData}&teklifMiktari=${ourOffer}.00`);

                    const winOfferLog2 = document.createElement("div")
                    winOfferLog2.textContent = `${ourOffer} ile ihale alındı!`
                    winOfferLog2.style.color = "green"
                    document.querySelector(".mulalpLogBox").appendChild(winOfferLog2)

                    console.log("teklif verildi!" + ourOffer)
                }

            }
        });
    };

    // -------------------------------------------------------------------------------------------------


    // UYAP HEADER MARGIN
    document.querySelector(".page-header").style.marginTop = "316px"


    // MULA HEADER

    const header = document.createElement("div")
    header.style.position = 'absolute';
    header.style.top = '0';
    header.style.left = '0';
    header.style.right = '0';
    header.style.background = 'transparent';
    header.style.height = '250px';


    header.innerHTML = `
        <div style="
            position: absolute;
            left: 16px;
            top: 16px;
            right: 16px;
            height: 220px;
            border-radius: 8px;
            border: 2px solid black;
            background: url(https://wallpaperaccess.com/full/1799752.jpg);
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            font-family: cursive;
            font-weight: bold;
            font-size: 14px;
            text-decoration: none;
            list-style-type: none;
            gap: 32px;
        " class="mulalpBody">
            <div style="display: flex; align-items: center; gap: 8px;">
                <img style="height: 120px;"
                    src="https://text.media.giphy.com/v1/media/giphy.gif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJwcm9kLTIwMjAtMDQtMjIiLCJzdHlsZSI6ImJhdHRsZXJveWFsZSIsInRleHQiOiJNVUxBIiwiaWF0IjoxNzI4MDQ1NjIwfQ._5TgFuSIuUVbU-w9xmVa0KrOzFN3kg8vkjwMweComy0"
                    alt="">

                <div style="display: flex; flex-direction: column; gap: 8px;" class="mulalpFormBox">
                    <div>
                        <div>Maksimum teklif</div>
                        <input style="outline: none;
                        background-color: rgba(255, 255, 255, 0.32);
                        border: none;
                        border-bottom: 4px solid white;
                        padding: 8px;
                        color: white;
                        font-family: cursive;
                        font-size: 12px;
                        border-radius: 4px;
                        margin-top: 4px;
                        font-weight: bold;
                    " type="number" name="" id="mulalpMaxOffer">
                    </div>
                    <div>
                        <div>Bir önceki teklife ilave</div>
                        <input style="outline: none;
                        background-color: rgba(255, 255, 255, 0.32);
                        border: none;
                        border-bottom: 4px solid white;
                        padding: 8px;
                        color: white;
                        font-family: cursive;
                        font-size: 12px;
                        border-radius: 4px;
                        margin-top: 4px;
                        font-weight: bold;
                    " type="number" name="" id="mulalpAdd">
                    </div>
                    <div>
                        <div>Teklife kalan saniye</div>
                        <input style="outline: none;
                        background-color: rgba(255, 255, 255, 0.32);
                        border: none;
                        border-bottom: 4px solid white;
                        padding: 8px;
                        color: white;
                        font-family: cursive;
                        font-size: 12px;
                        border-radius: 4px;
                        margin-top: 4px;
                        font-weight: bold;
                    " type="number" name="" id="mulalpSecond">
                    </div>
                </div>

                <div style="
                height: 265px;
                width: 640px;
                background-color: white;
                border: 2px solid black;
                margin-top: 45px;
                border-radius: 0px 0px 8px 8px;
                margin-left: 64px;
                color: black;
                display: flex;
                justify-content: end;
                align-items: end;
                padding: 8px;
                gap: 8px;
                flex-direction: column;
                overflow-y: hidden;
            " class="mulalpLogBox">
                    <div><a style="color: purple;" target="_blank" href="https://viraportal.com/">MULA 2.0'ın detaylı bilgisi için tıkla!</a></div>
                    <div class="MulaSecTimerDiv">0 gün / 0 saat / 0 dakika / 0 saniye</div>
                </div>
            </div>

            <div>
                <button style="
                        font-family: cursive;
                        border: none;
                        background: linear-gradient(to bottom, rgb(255, 0, 255), rgb(169, 0, 169));
                        width: 100px;
                        padding: 8px;
                        font-size: 14px;
                        color: white;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 4px;
                        margin-top: 164px;
                        margin-right: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    " class="mulalpStartBtn">Çalıştır!</button>
            </div>

        </div>
    `

    document.body.appendChild(header)


    // -------------------------------------------------------------------------------------------------


    // MULA CLICK EVENTS
    document.querySelector(".mulalpStartBtn").addEventListener("click", () => {

        const mulalpMaxOffer = document.getElementById("mulalpMaxOffer")
        const mulalpAdd = document.getElementById("mulalpAdd")
        const mulalpSecond = document.getElementById("mulalpSecond")





        const denemeTotal = Number(mulalpSecond.value)
        const MulaFormattedNumber = denemeTotal.toFixed(3);
        const [integerPart, decimalPart] = MulaFormattedNumber.split(".");

        const mulaSaniye = Number(integerPart)
        const mulaSalise = Number(decimalPart)

        // console.log(mulaSaniye)
        // console.log(mulaSalise)


        // const denemeLog = document.createElement("div")
        // denemeLog.textContent = `${integerPart} + ${decimalPart}`
        // denemeLog.style.color = "orange"
        // document.querySelector(".mulalpLogBox").appendChild(denemeLog)






        mulalpMaxOffer_u = Number(mulalpMaxOffer.value)
        mulalpAdd_u = Number(mulalpAdd.value)
        mulalpSecond_u = mulaSaniye
        mulalpMilisecond_u = mulaSalise




        if (mulalpMaxOffer_u && mulalpAdd_u && denemeTotal) {

            if (mulaRUN) {
                mulaRUN = false

                mulalpMaxOffer.disabled = false
                mulalpAdd.disabled = false
                mulalpSecond.disabled = false

                const stopLog = document.createElement("div")
                stopLog.textContent = "MULA Duraklatıldı!"
                stopLog.style.color = "orange"
                document.querySelector(".mulalpLogBox").appendChild(stopLog)


                document.querySelector(".mulalpStartBtn").textContent = "Çalıştır!"
            } else {
                mulaRUN = true

                mulalpMaxOffer.disabled = true
                mulalpAdd.disabled = true
                mulalpSecond.disabled = true

                const startLog = document.createElement("div")
                startLog.textContent = `Maksimum teklif : ${mulalpMaxOffer.value} / Bir önceki teklife ilave : ${mulalpAdd.value} / Teklife kalan saniye : ${mulalpSecond.value}`
                document.querySelector(".mulalpLogBox").appendChild(startLog)

                const startLog2 = document.createElement("div")
                startLog2.textContent = "MULA Çalışıyor!"
                startLog2.style.color = "green"
                document.querySelector(".mulalpLogBox").appendChild(startLog2)


                document.querySelector(".mulalpStartBtn").textContent = "Duraklat!"
            }


        } else {
            const errorLog = document.createElement("div")
            errorLog.textContent = "Lütfen bütün alanları doldurunuz!"
            errorLog.style.color = "red"
            document.querySelector(".mulalpLogBox").appendChild(errorLog)
        }
    })


    // -------------------------------------------------------------------------------------------------


    function secTimer() {
        const now = new Date();
        const timeRemaining = endTime - now;

        if (timeRemaining > 0) {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            const milliseconds = timeRemaining % 1000;

            const MulaSecTimer = document.querySelector('.MulaSecTimerDiv');
            MulaSecTimer.textContent = `${days} gün / ${hours} saat / ${minutes} dakika / ${seconds} saniye / ${milliseconds} salise`


            // if (mulaRUN) {
            //     if (milliseconds <= mulalpMilisecond_u) {
            //         console.log(milliseconds + " " + mulalpMilisecond_u)
            //     }
            // }


            if (mulaRUN) {
                if (hours == 0 && minutes == 0 && days == 0 && seconds <= mulalpSecond_u && milliseconds <= mulalpMilisecond_u) {
                    if (lastOffer + mulalpAdd_u <= mulalpMaxOffer_u && !mulaOFFER) {
                        mulaOFFER = true
                        ourOffer = lastOffer + mulalpAdd_u

                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', 'https://esatis.uyap.gov.tr/main/jsp/esatis/ihaleTeklifIslemleri_brd.ajx', true);
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send(`${lastRequestData}&teklifMiktari=${ourOffer}.00`);

                        const winOfferLog = document.createElement("div")
                        winOfferLog.textContent = `${ourOffer} ile ihale alındı!`
                        winOfferLog.style.color = "green"
                        document.querySelector(".mulalpLogBox").appendChild(winOfferLog)

                        console.log("teklif verildi! " + ourOffer)
                    }
                }
            }




            setTimeout(secTimer, 1)
        }
    }


})();