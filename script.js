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
let property ;
let containerProperties;


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

    property = finalEl;
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

// funtion to click on analize button 
analize.addEventListener("click", async () => {
    const head = statusof.querySelector(".head");
    containerProperties = String(container.innerHTML);
    container.innerHTML = "";
    let loader = document.createElement("div");
    loader.classList.add("loader");
    container.innerHTML = "";
    container.append(loader);
    let text = head.innerText;
    let arr = text.split(" ");
    let id = arr[arr.length - 1];
    let URL1 ;
    let URL2 ;
    let sector = Number(property.sector);
    console.log(sector);
    if(id.charAt(0)=== 'p' || id.charAt(0) === 'P' ){
        URL1 = `https://vpavs-1.onrender.com/predict/plot/${id}`;
    }
    else{
        URL1 = `https://vpavs-1.onrender.com/predict/house/${id}`;
    }
    URL2 = `https://vpavs.onrender.com/api/properties/sectors/${sector}`
    
    let response = await fetch(URL1);
    let data = await response.json();
    const predictions = data.predictions; 

    console.log("check1");
    response = await fetch(URL2);
    const sectorDetails = await response.json();
    console.log("check2");
    addAnalisis(id,predictions,sectorDetails);
    console.log("check3");
});



// funtion to add tables on container after clicking analize button 
function addAnalisis(id, predictions, sectorDetails) {
    console.log(sectorDetails,property);
    container.innerHTML = "";

    let canalize = document.createElement("div");
    canalize.classList.add("canalize");

    let c1 = document.createElement("div");
    c1.classList.add("c1");

    const title = document.createElement("h3");
    title.innerText = "1. Property Valuation (5 Year Prediction)";

    const canvas = document.createElement("canvas");
    canvas.id = "priceChart";

    c1.appendChild(title);
    c1.appendChild(canvas);
    canalize.append(c1);
    container.append(canalize);

    canalize = container.querySelector(".canalize");

    // ✅ SORT FIRST
    predictions.sort((a, b) => a.year - b.year);

    // ✅ ADD CURRENT YEAR DATA
    if (predictions.length > 0) {
        const firstYear = predictions[0].year;
        const currentYear = firstYear - 1;

        const currentPrice =
            property.price ||
            property.price_per_sqft ||
            property.predicted_price ||
            50000; // fallback

        const firstGrowth = predictions[0].growth_percent || 10;
        const currentGrowth = Math.max(firstGrowth - 20, 5);

        predictions.unshift({
            year: currentYear,
            predicted_price: currentPrice,
            growth_percent: currentGrowth
        });
    }

    // ✅ MAP AFTER ADDING
    const years = predictions.map(d => d.year);
    const prices = predictions.map(d => d.predicted_price);
    const growth = predictions.map(d => d.growth_percent);

    // ✅ CHART
    new Chart(canvas, {
        type: "line",
        data: {
            labels: years,
            datasets: [
                {
                    label: "Price (₹)",
                    data: prices,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 5
                },
                {
                    label: "Growth %",
                    data: growth,
                    borderDash: [6, 6],
                    tension: 0.4,
                    yAxisID: "y1",
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    position: "top"
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (context.dataset.label.includes("Price")) {
                                return "₹ " + context.raw.toLocaleString();
                            }
                            return context.raw + "%";
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Year"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Price (₹)"
                    },
                    ticks: {
                        callback: value => "₹ " + value
                    },
                    beginAtZero: true
                },
                y1: {
                    position: "right",
                    title: {
                        display: true,
                        text: "Growth %"
                    },
                    ticks: {
                        callback: value => value + "%"
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    beginAtZero: true
                }
            }
        }
    });

    let c2 = document.createElement("div");
    c2.classList.add("c2");

    const canvas2 = document.createElement("canvas");
    canvas2.id = "sectorChart";

    let title2 = document.createElement("h3");
    title2.innerText = "2. Sector Analysis (Key Factors)";
    c2.appendChild(title2);
    c2.appendChild(canvas2);

    new Chart(canvas2, {
        type: "radar",
        data: {
            labels: [
            "Rental Demand",
            "Industrial Rating",
            "Traffic Rate",
            "Crime Rate",
            "Pollution Rate",
            "Sports Club Rating"
            ],
            datasets: [{
            label: "Sector Score (out of 10)",
            data: [
                sectorDetails.rental_demand,
                sectorDetails.industrial_rating,
                sectorDetails.traffic_rate,
                sectorDetails.crime_rate,
                sectorDetails.pollution_rate,
                sectorDetails.sports_club_rating
            ],
            borderWidth: 2,
            pointRadius: 4,
            fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // 🔥 important
            plugins: {
            legend: {
                position: "bottom"
            }
            },
            scales: {
            r: {
                beginAtZero: true,
                min: 0,
                max: 10,
                ticks: {
                stepSize: 2
                }
            }
            }
        }
        });



    let backbtn = document.createElement("button");
    backbtn.classList.add("backbtn");
    backbtn.innerHTML = "←";

    let c3 = document.createElement("div");
    c3.classList.add("c3");
    let title3 = document.createElement("h3");
    title3.innerText = "3. Nearby Infrastructure (Distance in km)";
    const canvas3 = document.createElement("canvas");
    canvas3.id = "distanceChart";
    c3.append(title3);
    c3.appendChild(canvas3);

    const base = property.distance_from_main_road_km || 0;

    const distances = [
    sectorDetails.nearby_metro_distance_km + base,
    sectorDetails.nearest_hospital_distance_km + base,
    sectorDetails.nearest_mall_distance_km + base,
    sectorDetails.nearest_college_distance_km + base,
    sectorDetails.railway_station_distance_km + base,
    sectorDetails.national_highway_distance_km + base
    ];

    new Chart(canvas3, {
    type: "bar",
    data: {
        labels: [
        "Metro Station",
        "Hospital",
        "Mall",
        "College",
        "Railway Station",
        "National Highway"
        ],
        datasets: [{
        label: "Distance (KM)",
        data: distances,
        borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // 🔥 important
        plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
            label: function(context) {
                return context.raw.toFixed(2) + " KM";
            }
            }
        }
        },
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: "Distance (KM)"
            }
        },
        x: {
            title: {
            display: true,
            text: "Amenities"
            }
        }
        }
    }
    });
   

    let c4 = document.createElement("div");
    c4.classList.add("c4");
    
    let arr = new Array(5);

    for(let i = 0 ; i <= 4 ; i++){
        arr[i] = document.createElement("div");
        arr[i].classList.add("c4-child");
        let img = document.createElement("img");
        img.classList.add("c4-img");
        let c4Child2 = document.createElement("div");
        c4Child2.classList.add("c4-child2");
        let t1 = document.createElement("h5");
        let t2 = document.createElement("h4");
        c4Child2.append(t1,t2);
        arr[i].append(img,c4Child2)
    }
    
    console.log(sectorDetails);
    arr[0].querySelector(".c4-img").src = "./img/users-alt.png";
    arr[0].querySelector("h5").innerHTML = "Population Density";
    arr[0].querySelector("h4").innerHTML = `${sectorDetails["population_density"]} /Km`;

    arr[1].querySelector("img").src = "./img/money-income.png";
    arr[1].querySelector("h5").innerHTML = "Average Income";
    arr[1].querySelector("h4").innerHTML =`₹ ${ sectorDetails["average_income_level"]} /Y`;

    arr[2].querySelector("img").src = "./img/growth-chart-invest.png";
    arr[2].querySelector("h5").innerHTML = "Transaction Volume";
    arr[2].querySelector("h4").innerHTML = `${sectorDetails["transaction_volume"]} /Hr`;

    arr[3].querySelector("img").src = "./img/workflow-setting-alt.png";
    arr[3].querySelector("h5").innerHTML = "Actice Govt. Project";
    arr[3].querySelector("h4").innerHTML = sectorDetails["active_government_projects"];
    
    arr[4].querySelector("img").src = "./img/memo-circle-check.png";
    arr[4].querySelector("h5").innerHTML = "Future Govt. Project";
    arr[4].querySelector("h4").innerHTML = sectorDetails["future_government_projects"];


    arr.forEach((ele)=>{
        c4.append(ele);
    })


    canalize.append(c2,c3,c4,backbtn);
    container.append(canalize);
}

// funtion for back button in analysis window 
document.addEventListener("click", (e) => {
    if(e.target.classList.contains("backbtn")) {
        container.innerHTML = "";
        container.innerHTML = containerProperties;
    }
});

