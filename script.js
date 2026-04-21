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
let statusof = document.querySelector(".status");
let stDetails = document.querySelector(".status .details");
const analize = document.querySelector(".analize")
const item = document.querySelectorAll(".item");
const b2 = document.querySelector("#b3");
const searchInput = document.querySelector("#search");


// funtion for adding second select menu
op1.addEventListener("change",secondselect );
addEventListener("load",secondselect());

// funtion to adding second option 
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

// funtion for visibility of the how to use bar 
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

    let loader = document.createElement("div");
    loader.classList.add("loader");
    container.innerHTML = "";
    container.append(loader);

    container.style.width = "100%";
    statusof.style.display = "none";
    console.log(op1.value);
    let inputbox = e.target.closest(".inputBox");
    let op2 = inputbox.querySelector("[name='range']")
    loadData(op1.value,op2.value);
})

// funtion to add items on container 
async function loadData(var1 , var2) {

    loaderCheck = true;

    if( var1 === "plot"){
         // this will be the array from the JSON
        temp1 = var2*2;
        temp2 = temp1 + 1;
        
        let response = await fetch(`https://vpavs.onrender.com/api/properties/plots/range?min=${areaRange2[temp1]}&max=${areaRange2[temp2]}`);
        let data = await response.json();
        console.log(data);
        

        for(val of data){
            let item = document.createElement("div");
            item.classList.add("item");
            let h2 = document.createElement("h2");
            h2.innerText = `${val["price"]}/-`;
            let h3 = document.createElement("h3");
            h3.innerText = `Area  :  ${val["area_sqft"]} sqrf Plot`
            let h4 = document.createElement("h4");
            h4.innerText = `Location  :  Sector ${val["sector"]}`
            let b = document.createElement("b");
            b.setAttribute("id","id");
            b.innerText = `${val["id"]}`;
            let p = document.createElement("p");
            p.innerText = `Distance from Main Road  :  ${val["distance_from_main_road_km"]} || Plot id  :  `
            p.append(b);
            item.append(h2,h3,h4,p);
            

            if(loaderCheck){
                container.innerHTML = "";
                loaderCheck = false;
            }
            container.append(item);
        }
    }
    else{
        let temp = 0;
        if(var2 == 0) temp = 2;         // for 2bhk request 
        else temp = 3;                  // for 3bhk request 
        let response = await fetch(`https://vpavs.onrender.com/api/properties/house/bhk/${temp}`);
        let data = await response.json();
        console.log(data); // this will be the array from the JSON
        for(val of data){
            let item = document.createElement("div");
            item.classList.add("item");
            let h2 = document.createElement("h2");
            h2.innerText = `${val["price"]}/-`;
            let h3 = document.createElement("h3");
            h3.innerHTML = `Area  :  ${val["area_sqft"]} sqrf ${val["bhk"]}BHk House`
            let h4 = document.createElement("h4");
            h4.innerText = `Location  :  Sector ${val["sector"]}`
            let b = document.createElement("b");
            b.setAttribute("id","id");
            b.innerText = `${val["id"]}`;
            let p = document.createElement("p");
            p.innerText = `Distance from Main Road  :  ${val["distance_from_main_road_km"]} || House id  :  `
            p.append(b);
            item.append(h2,h3,h4,p);
            if(loaderCheck){
                container.innerHTML = "";
                loaderCheck = false;
            }
            container.append(item);
        }
    }
    return;
}

// function for click on item 
addEventListener("click",(e)=>{
    if (e.target.classList.contains("item") || e.target.parentElement.classList.contains("item")){

        statusof.style.display = "flex";
        container.style.width = "74%";
        stDetails.innerHTML = "";
        stDetails.classList.add("align");
        let loader = document.createElement("div");
        loader.classList.add("loader");
        stDetails.append(loader);

        let target = e.target;
        let item = e.target.closest(".item");
        let id = item.querySelector("#id");
        console.log(id.innerText);
        // calling to printDetail funtion 
        fatchDetail(id.innerText ,0);

    }
})



// printing data on status bar 
function printDetail(finalEl){

    let head = document.querySelector(".head");
    head.innerText = `${(finalEl["type"])} ID  :  ${finalEl["id"]}`;

    let price = document.createElement("h2");
    price.classList.add("print1");
    price.innerText = `Price  :  ${finalEl["price"]}/-`;

    let area = document.createElement("h3");
    area.classList.add("print1");     
    area.innerText = `Area of ${finalEl["type"]} is  :  ${finalEl["area_sqft"]}`;   // 201

    let sector = document.createElement("h3");
    sector.classList.add("print1");
    sector.innerText = `Sector  :  ${finalEl["sector"]}`;

    let cornerProperty = document.createElement("p");
    cornerProperty.classList.add("print");
    cornerProperty.innerText = `Corner Property  :  ${finalEl["corner_property"]}`

    let disFromMRoad = document.createElement("p");
    disFromMRoad.classList.add("print");
    disFromMRoad.innerText = `Distance of Property form Main road  :  ${finalEl["distance_from_main_road_km"]}`
    
    let facing = document.createElement("p");
    facing.classList.add("print");
    facing.innerText = `Facing  :  ${finalEl["facing"]}`

    let registrationStatus = document.createElement("p");
    registrationStatus.classList.add("print");
    registrationStatus.innerText = `Registration Status  :  ${finalEl["registration_statusof"]}`

    let owner = document.createElement("p");
    owner.classList.add("print");
    owner.innerText = `Owner Name  :  ${finalEl["owner_name"]}`

    let ownerPhone = document.createElement("p");
    ownerPhone.classList.add("print");
    ownerPhone.innerText = `Owner Contact: ${finalEl["owner_phone"]}`

    let loanApprovel = document.createElement("p");
    loanApprovel.classList.add("print");
    loanApprovel.innerText = `Loan Approvel  :  ${finalEl["loan_approved"]}`

    // for plot type details only 
    if( finalEl["type"] === "plot"){
        // only for plot 
        let landType = document.createElement("p");
        landType.classList.add("print");
        landType.innerText = `Land Type  :  ${finalEl["land_type"]}`

        let boundryWall = document.createElement("p");
        boundryWall.classList.add("print");
        if(finalEl["boundary_wall"]=== true) boundryWall.innerText = `Boundray Wall  :  Available`;
        else boundryWall.innerText = `Boundray Wall  :  Not Available`;

        let soilType = document.createElement("p");
        soilType.classList.add("print");
        soilType.innerText = `Soil Type  :  ${finalEl["soil_type"]}`

        
        stDetails.innerHTML = "";
        stDetails.classList.remove("align");
        
        stDetails.append(price,area,sector,cornerProperty,disFromMRoad,facing,registrationStatus,owner,ownerPhone,loanApprovel,landType,boundryWall,soilType);
    
    }
    // for house type details only 
    else{
        let bhk = document.createElement("p");
        bhk.classList.add("print");
        bhk.innerText = `BHK  :  ${finalEl["bhk"]}`

        let floors = document.createElement("p");
        floors.classList.add("print");
        floors.innerText = `Number of Floors  :  ${finalEl["floors"]}`

        let bathrooms = document.createElement("p");
        bathrooms.classList.add("print");
        bathrooms.innerText = `Number of Bathrooms  :  ${finalEl["bathrooms"]}`

        let balcony = document.createElement("p");
        balcony.classList.add("print");
        balcony.innerText = `Number of Balconies  :  ${finalEl["balcony"]}`

        let parking = document.createElement("p");
        parking.classList.add("print");
        if(finalEl["parking_available"] === true ){
            parking.innerText = `Parking  :  Available`
        }
        else parking.innerText = `Parking  :  Not Available`


        let constuctYear = document.createElement("p");
        constuctYear.classList.add("print");
        constuctYear.innerText = `Construction Year  :  ${finalEl["construction_year"]}`

        let furnishStatus = document.createElement("p");
        furnishStatus.classList.add("print");
        furnishStatus.innerText = `FurnishStatus  :  ${finalEl["furnished_statusof"]}`

        stDetails.innerHTML = "";
        stDetails.classList.remove("align");

        stDetails.append(price,area,sector,cornerProperty,disFromMRoad,facing,registrationStatus,owner,ownerPhone,loanApprovel,bhk,floors,bathrooms,balcony,parking,constuctYear,furnishStatus);
    }
    return;
}

// fatching single details -> printDetail
async function fatchDetail(id,x) {     
    
    // x is refers to which funtion is called
    // if x = 0 means clicked on item and if x = 1 means it is send by the searchbox

    let URL = "";

    if (id.charAt(0) == 'P') {
        URL = `https://vpavs.onrender.com/api/properties/plot/${id}`;
    } else {
        URL = `https://vpavs.onrender.com/api/properties/house/${id}`;
    }

    
    let response = await fetch(URL);   

    let data = await response.json();

    
    if(data.length == 0){
        container.innerHTML = "";
        stDetails.innerHTML = "";
        statusof.style.display = "none";
        container.innerHTML = "<h2>Oh! Sorry Data in not Available</h2> ";
        return;
    }
    
    let finalEl = data[0];
    
    if(x != 0){
        container.innerHTML = "";
        container.innerHTML = `<h1>Property id ${finalEl["id"]} data showed in Status Bar </h1>`;
    }
    
    printDetail(finalEl);
    return;
}

// function to check input is valid or not  serachData() -> fetchdetail
async function searchData(){
    let input = searchInput.value;
    searchInput.value = "";
    input = input.trim().toUpperCase();
    console.log(input);
    let URL = '';
    if(input.length <= 2){
        container.innerHTML = "Invalid Input";
        return;
    } 
    let idx0 = input.charAt(0);
    let idx1 = input.charAt(1);

    container.innerHTML = "";
    stDetails.innerHTML = "";
    statusof.style.display = "flex";
    container.style.width = "74%";
    stDetails.classList.add("align");
    let loader = document.createElement("div");
    loader.classList.add("loader");
    stDetails.append(loader);
    loader = document.createElement("div");
    loader.classList.add("loader");
    container.append(loader);

    if( idx0 == 'P'){
        fatchDetail(input,1);       // one is refers that the fetchDetail is called by serachData
    }
    else if((idx0 == '2' || idx0 == '3') && idx1 == 'H'){
        fatchDetail(input,1);
    }
    else{
        container.innerHTML = "Invalid Input";
    }
    return;
}

// funtion for search button  -> fatchDetail 
b3.addEventListener("click",()=>{
    searchData();
    return;
})
searchInput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
        searchData();
    }
    return;
})

// funtion of analize button 
analize.addEventListener("click", async () => {

    const head = statusof.querySelector(".head");
    let text = head.innerText;

    // split text
    let arr = text.split(" ");

    // safer extraction (last value instead of fixed index)
    let id = arr[arr.length - 1];

   

    let URL = `https://vpavs-1.onrender.com/predict/house/${id}`;

    try {
        let response = await fetch(URL);

        let data = await response.json(); // ✅ FIXED

        console.log(data);
    } catch (err) {
        console.error("Fetch error:", err);
    }
});