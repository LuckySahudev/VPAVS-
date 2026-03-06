
const selectBox = document.querySelector(".selectBox");
const op1 = document.querySelector("[name='TypeOfProperty']");
let htu = document.querySelector(".howToUse");
let b1 = document.querySelector("#b1"); 
const btn1 = document.querySelector("#btn1");
let areaRange = ["0-1000","1000-2000","2000-4000","4000-6000","6000-10000"];
let areaRange2 = [0,1000,1000,2000,2000,4000,4000,6000,6000,10000];
let houseType = ["2bhk", "3bhk"];
let check = 0 ; 
const main = document.querySelector("main");
const container = document.querySelector(".container");
const item = document.querySelectorAll(".item");


// funtion for adding second select menu
op1.addEventListener("change",secondselect );
addEventListener("load",secondselect());
function secondselect(){
    check ++;
    // Remove old dynamic select only
    const oldSelect = document.querySelector(".dynamicSelect");
    if (oldSelect) {
        oldSelect.remove();
    }

    let range = document.createElement("select");
    range.name = "range";
    range.classList.add("dynamicSelect");

    let data = [];

    if (op1.value === "plot") {
        data = areaRange;
    } else if (op1.value === "house") {
        data = houseType;
    }
    let i = 0 ;
    data.forEach(item => {
        let option = document.createElement("option");
        option.textContent = item;
        option.value = i++;
        range.appendChild(option);
    });

    selectBox.appendChild(range);
}

// funtion for how to use 
htu.innerHTML = `<h3>How to Use</h3>
    <p><strong>1. Search by Property Type</strong></p>
    <ul>
        <li>Select <b>Plot</b> or <b>House</b> from the first dropdown.</li>
        <li>Select the <b>price range</b> from the second dropdown.</li>
        <li>Click the <b>Submit</b> button.</li>
        <li>Available properties will appear below.</li>
    </ul>
    <p><strong>2. Search by Property ID</strong></p>
    <ul>
        <li>Use the search bar on the right.</li>
        <li>Enter the property ID (Example: <b>p123</b> or <b>h245</b>).</li>
        <li>Click the search icon.</li>
        <li>The specific property details will be displayed.</li>
        </ul>`

b1.addEventListener("click", () => {
    htu.style.visibility = "visible";
});
document.addEventListener("click", (e) => {
    if (e.target !== htu && e.target !== b1){
        htu.style.visibility = "hidden";
    }
});


// funtion for submit button 

btn1.addEventListener("click",(e)=>{
    if( check === 0) return;
    console.log(op1.value);
    let inputbox = e.target.closest(".inputBox");
    let op2 = inputbox.querySelector("[name='range']")
    console.log(op2.value);
    loadData(op1.value,op2.value);
})



async function loadData(var1 , var2) {
    container.innerHTML = "";
    if( var1 === "plot"){
        let response = await fetch('./data/plot.json');
        let data = await response.json();
        console.log(data); // this will be the array from the JSON
        temp1 = var2*2;
        temp2 = temp1 + 1;
        let finaldata = data.filter((val)=>{
            return ( val["area_sqft"] > areaRange2[temp1] && val["area_sqft"] <= areaRange2[temp2])
        })
        console.log(finaldata);

        for(val of finaldata){
            let item = document.createElement("div");
            item.classList.add("item");
            let h2 = document.createElement("h2");
            h2.innerText = `${val["price"]}/-`;
            let h3 = document.createElement("h3");
            h3.innerText = `Area : ${val["area_sqft"]} sqrf Plot`
            let h4 = document.createElement("h4");
            h4.innerText = `Location : Sector ${val["sector"]}`
            let b = document.createElement("b");
            b.setAttribute("id","id");
            b.innerText = `${val["id"]}`;
            let p = document.createElement("p");
            p.innerText = `Distance from Main Road : ${val["distance_from_main_road_km"]} || Plot id : `
            p.append(b);
            item.append(h2);
            item.append(h3);
            item.append(h4);
            item.append(p);
            container.append(item);
        }
    }
    else{
        let temp = houseType[var2] ; 
        let response = await fetch(`./data/${temp}.json`);
        let data = await response.json();
        console.log(data); // this will be the array from the JSON
        for(val of data){
            let item = document.createElement("div");
            item.classList.add("item");
            let h2 = document.createElement("h2");
            h2.innerText = `${val["price"]}/-`;
            let h3 = document.createElement("h3");
            h3.innerHTML = `Area : ${val["area_sqft"]} sqrf ${val["bhk"]}BHk House`
            let h4 = document.createElement("h4");
            h4.innerText = `Location : Sector ${val["sector"]}`
            let b = document.createElement("b");
            b.setAttribute("id","id");
            b.innerText = `${val["id"]}`;
            let p = document.createElement("p");
            p.innerText = `Distance from Main Road : ${val["distance_from_main_road_km"]} || House id : `
            p.append(b);
            item.append(h2);
            item.append(h3);
            item.append(h4);
            item.append(p);
            container.append(item);
        }
    }
    return;
}

addEventListener("click",(e)=>{
    if (e.target.classList.contains("item") || e.target.parentElement.classList.contains("item")){
        let target = e.target;
        let item = e.target.closest(".item");
        let id = item.querySelector("#id");
        console.log(id.innerText);
        // calling to printDetail funtion 
        fatchDetail(id.innerText);

    }
})


async function fatchDetail(id) {
    let URL = '';
    if(id[0]==='p') URL = `./data/plot.json`;
    else if(id[0]=== '2') URL = `./data/2bhk.json`;
    else URL = `./data/3bhk.json`;

    let response = await fetch(URL);
        let data = await response.json();
        let finalEl
        for( val of data){
            if(val["id"]===id){ 
                finalEl = val ; 
                break;
            }
        }
        printDetail(finalEl,data);
    return;
}

function printDetail(finalEl){

    
    let head = document.createElement("h2");
    head.classList.add("head");
    head.innerText = `${finalEl["type"].toUpperCase()} ID : ${finalEl["id"]}`;

    let price = document.createElement("h3");
    price.classList.add("print");
    price.innerText = `Price : ${finalEl["price"]}`;

    let area = document.createElement("h2");
    area.classList.add("print");
    area.innerText = `Area of ${finalEl["type"].toUpperCase()} is : ${finalEl["area_sqft"]}`;

    let sector = document.createElement("h2");
    sector.classList.add("print");
    sector.innerText = `Sector : ${finalEl["sector"]}`;

    let cornerProperty = document.createElement("p");
    cornerProperty.classList.add("print");
    cornerProperty.innerText = `Corner Property : ${finalEl["corner"]}`

    let disFromMRoad = document.createElement("p");
    disFromMRoad.classList.add("print");
    disFromMRoad.innerText = `Distance of Property form Main road : ${finalEl["distance_from_main_road_km"]}`
    
    let facing = document.createElement("p");
    facing.classList.add("print");
    facing.innerText = `Facing : ${finalEl["facing"]}`

    let registrationStatus = document.createElement("p");
    registrationStatus.classList.add("print");
    registrationStatus.innerText = `Registration Status : ${finalEl["registration_status"]}`

    let owner = document.createElement("p");
    owner.classList.add("print");
    owner.innerText = `Owner Name : ${finalEl["owner_name"]}`

    let ownerPhone = document.createElement("p");
    ownerPhone.classList.add("print");
    ownerPhone.innerText = `Owner Contact: ${finalEl["loan_approved"]}`

    let loanApprovel = document.createElement("p");
    loanApprovel.classList.add("print");
    loanApprovel.innerText = `Loan Approvel : ${finalEl["loan_approved"]}`



    // only for plot 
    let landType = document.createElement("p");
    landType.classList.add("print");
    landType.innerText = `Land Type : ${finalEl["land_type"]}`

    
    let boundryWall = document.createElement("p");
    boundryWall.classList.add("print");
    if(finalEl["boundary_wall"]=== true) boundryWall.innerText = `Boundray Wall : Available`;
    else boundryWall.innerText = `Boundray Wall : Not Available`;


    let soilType = document.createElement("p");
    soilType.classList.add("print");
    soilType.innerText = `Soil Type : ${finalEl["soil_type"]}`


}


// extera in house
//     "bhk": 2,
//     "floors": 3,
//     "bathrooms": 1,
//     "balcony": 3,
//     "parking_available": false,
//     "construction_year": 2026,
//     "furnished_status": "unfurnished",






// extera in plot 
//     "land_type": "commercial",
//     "boundary_wall": false,
//     "soil_type": "clay",
