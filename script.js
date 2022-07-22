let groupSize = 0;
let groupFormat = null;
let repeatFemale = false;
let repeatMale = false;

let participants = []

let toSort = [];
let sorted = [];
let groups = [];


function AddParticipant(name, gender) {

    if(name == "" ) throw new Error("Name is required")
 
    let Duplicated = participants.find(participant => participant.name === name)

    if(gender != "male" && gender != "female") throw new Error("Erro while creating participant, check input info")

    if(Duplicated)throw new Error("Participante allredy exists")
    

    const newParticipant =  {
        name: name,
        gender: gender
    };

    participants.push(newParticipant);
    return newParticipant;
}

function RemoveParticipant(name) {

    let participant = participants.find(participant => participant.name === name)
    if(!participant) throw new Error("Participant not found")    
    participants.splice(participants.indexOf(participant),1);
}

function generateGroupFormat(MaleCount) {

    let format = {} ;

    if (MaleCount > groupSize || MaleCount <= 0) throw new Error("Male count is invalid")

    format.female = groupSize - MaleCount
    format.male = MaleCount
    groupFormat = format;

}

function getFemaleCountFromGroupFormat(){
    return groupFormat.female
}

function SetRepeatFemale(value){

    if(typeof value != "boolean" ) throw new Error("Invalid type")
    repeatFemale = value
}

function SetRepeatMale(value){

    if(typeof value != "boolean" ) throw new Error("Invalid type")

    repeatMale = value;
}

function setGroupsize(count){


    if(count <= 0 ) throw new Error("Group Size cannot be zero or less")
    if(count > participants.length) throw new Error("Group Size has to be less then participants count")

    groupSize = count
}

function MountGroups() {
    
    //reset variables
     toSort = [];
     sorted = [];
     groups = [];


    if(participants.length <= 0 ) throw new Error("You shoud add participants before sort")
    if(groupSize > participants.length || groupSize <= 0) throw new Error("Invalid Group size")
    
    toSort =[...participants]
    let group = [];
    let QtdGroup = Math.ceil(participants.length / groupSize)

    if (groupFormat) {
        
        let MaleParticipantsCount = (participants.filter(part => part.gender == "male").length)
        let FemaleParticipantsCount = (participants.filter(part => part.gender == "female").length)
        

        if(MaleParticipantsCount/groupFormat.male >= FemaleParticipantsCount/groupFormat.female){
            QtdGroup = Math.ceil(MaleParticipantsCount/groupFormat.male)
        }else{
            QtdGroup = Math.ceil(FemaleParticipantsCount/groupFormat.female)
        }

        for (let index = 0; index < QtdGroup; index++) {

            group = []

            for (let index = 0; index < groupFormat.male; index++) {

                let sorted;
                do {
                    sorted = PickRandonParticipantBasedOnGender("male")

                } while (Exists(sorted,group));

               if( sorted ) group.push(sorted)
            }


            for (let index = 0; index < groupFormat.female; index++) {

                let sorted;
                do {
                    sorted = PickRandonParticipantBasedOnGender("female")
                    
                } while (Exists(sorted,group));

               if( sorted ) group.push(sorted)
            }

            if (group.length > 0) groups.push(group);

        }


    } else {


        for (let index = 0; index < QtdGroup; index++) {
            
            group = []


            for (let index = 0; index < groupSize; index++) {

                let sorted;
                do {
                    sorted = PickRandonParticipantBasedOnGender("all")

                } while (Exists(sorted, group));
                
               if(sorted) group.push(sorted)
            }

            groups.push(group);

        }
     }


}

function getRandomIndexFromArray(array) {
    return Math.floor(Math.random() * (array.length));
}

function TransferParticipantsToResort(gender) {


    if (gender == "female") {
        let allSortedFemales = sorted.filter(part => part.gender == "female");
        allSortedFemales.forEach(sf => {
            sorted.splice(sorted.indexOf(sf), 1);
            toSort.push(sf);
        })
    }

    if (gender == "male") {
        let allSortedMales = sorted.filter(part => part.gender == "male");
        allSortedMales.forEach(sf => {
            sorted.splice(sorted.indexOf(sf), 1);
            toSort.push(sf);
        })
    }

}

function TransferParticipantToSorted(SortedParticipant){

    toSort.splice(toSort.indexOf(SortedParticipant), 1);
    sorted.push(SortedParticipant);
}

function PickRandonParticipantBasedOnGender(gender) {

    let SortedParticipant = null;

    if (gender === "male") {

        let allMales = toSort.filter(part => part.gender == "male");

        if (allMales.length == 0 && repeatMale){
            TransferParticipantsToResort("male")
            allMales = toSort.filter(part => part.gender == "male");
        } 

        if (allMales.length == 0 ) return null

        
        SortedParticipant = allMales[getRandomIndexFromArray(allMales)]
      
        TransferParticipantToSorted(SortedParticipant)
        
        return SortedParticipant

    }
    if (gender === "female") {

        let allFemales = toSort.filter(part => part.gender == "female");

        if (allFemales.length == 0 && repeatFemale){
            TransferParticipantsToResort("female")
            allFemales = toSort.filter(part => part.gender == "female");
        } 
        
        if (allFemales.length == 0 ) return null

        
        SortedParticipant = allFemales[getRandomIndexFromArray(allFemales)]
      
        TransferParticipantToSorted(SortedParticipant)
        
        return SortedParticipant
    }

    if (gender === "all") {

        if(toSort.length == 0){
            if(repeatFemale)  TransferParticipantsToResort("female")
            if(repeatMale)  TransferParticipantsToResort("male")

        }

        if (toSort.length == 0 ) return null

        SortedParticipant = toSort[getRandomIndexFromArray(toSort)]
     
        TransferParticipantToSorted(SortedParticipant)
        
        return SortedParticipant;
    }

    
}

function Exists(sorted, group) {

    return group.includes(sorted)

}


//ERROR HANDLLE FUNCTION

function handlleErrors(error){
    alert(error.message);
}

// RENDER FUNCTION HELPERS
function RenderParticipant(participant){
    let ParticipantsList = document.querySelector("#participants-list")

    const newParticipant  = `
    <div id="${participant.name}" class="inline-flex items-center justify-between p-2 pl-2 ${participant.gender == "male" ? "bg-blue-200" : "bg-red-200"} ">
        <span class="">${participant.name}</span>
        <span onclick="handleRemoveParticipant('${participant.name}')"
            class="cursor-pointer bg-white text-red-500 font-bold px-2 rounded">X</span>
    </div>
    `;

    ParticipantsList.insertAdjacentHTML("beforeend" ,newParticipant);
}

function EraseParticipant(id){
    let ParticipantsList = document.querySelector("#participants-list")
    let ArrayFromParticipantsList = Array.from(ParticipantsList.children)

    let participant = ArrayFromParticipantsList.find(paricipant => paricipant.id == id) 

    if(participant) participant.remove()
}

function RenderGroupListParticipant(participant){

    const newGroupListParticipant = `
    <li class="p-1 ${participant.gender == "male" ? "bg-blue-200" : "bg-red-200"} ">${participant.name}</li>`
    return newGroupListParticipant;
}

function RenderGroupList(participants){

    let participantsList = ''

    participants.forEach(participant=>{
        participantsList += RenderGroupListParticipant(participant)
    })

    return participantsList;
}

function RenderGroup(index,participants){
    
    let GroupList = document.querySelector("#group-list")

    const newGroup  = `
    <div class="flex flex-col border-2 mb-2">
        <span class="px-2 bg-gray-400 font-bold">#Group ${index+1}</span>
        <ul class="flex flex-wrap gap-1 p-2">
            ${RenderGroupList(participants)}
        </ul>
    </div>
    `;

    GroupList.insertAdjacentHTML("beforeend" ,newGroup);
}

function EraseAllGroups(){
    let GroupList = document.querySelector("#group-list")
    let ArrayFromGroupList = Array.from(GroupList.children)

    ArrayFromGroupList.forEach((group)=>{group.remove()})
}

// ON CHANGE FUNCTIONS
function handlleRepeatFemaleParticipantChange(){
    const repeatFemaleParticipant = document.querySelector("#repeat-participant-male").checked;

    try {
        SetRepeatFemale(repeatFemaleParticipant);
    } catch (error) {
        handlleErrors(error);
    }
}

function handlleRepeatMaleParticipantChange(){

    const repeatMaleParticipant = document.querySelector("#repeat-participant-female").checked;

    try {
        SetRepeatMale(repeatMaleParticipant);
    } catch (error) {
        handlleErrors(error);
    }

}

function handlleGroupSizeChange(){
    const grouSizeInput = document.querySelector("#input-Group-Size");
    
    try {
        setGroupsize(grouSizeInput.value);
    } catch (error) {
        handlleErrors(error)
    }
}

function handleGroupFormatMaleCountChange(){
    const GroupFormatMaleInput = document.querySelector("#input-male-count");
    const GroupformatFemaleInput = document.querySelector("#input-female-count");

    try {
        generateGroupFormat(GroupFormatMaleInput.value)
        GroupformatFemaleInput.value = getFemaleCountFromGroupFormat()
    } catch (error) {
        handlleErrors(error)
        GroupFormatMaleInput.value = 0;
        GroupformatFemaleInput.value = 0;
    }
}

// CLICK EVENTS FUNCTIONS
function handleSaveParticipant(){
    const radios = document.getElementsByName('radio-gender');
    const nameIput = document.querySelector("#input-name");

    let gender;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            gender= radios[i].value;
                break;
        }
    }

    try {
        const newParticipant = AddParticipant(nameIput.value,gender);
        RenderParticipant(newParticipant);
        nameIput.value ="";
        
    } catch (error) {
        handlleErrors(error)
    }

}

function handleRemoveParticipant(id){
    try {
        RemoveParticipant(id)
        EraseParticipant(id)
    } catch (error) {
        handlleErrors(error)
    }
}

function handleSortGroups(){

    try {
        EraseAllGroups();
        MountGroups()

        groups.forEach(((group,index) =>{
           RenderGroup(index,group)
        }))
    } catch (error) {
        handlleErrors(error)  
    }
}

function togglePartiipantsList(){

    let btn = document.querySelector("#btn-ParticipantsList-toggler");
    let configurationSection = document.querySelector("#participants-list")



    if(btn.innerHTML == "▼"){
        configurationSection.classList.remove("hidden")
        btn.innerHTML = "▲"
    }else{
        btn.innerHTML="▼"
        configurationSection.classList.add("hidden")
    }


}

function toggleGroupformat(){
    const checkbox = document.querySelector("#group-format");
    let maleCountInput = document.querySelector("#input-male-count")
    let femaleCountInput = document.querySelector("#input-female-count")



    if(!checkbox.checked){
        maleCountInput.disabled = true;
        femaleCountInput.disabled = true;
        groupFormat = null;
    }else{
        maleCountInput.disabled = false;
        femaleCountInput.disabled = false;
    }


}

function toggleConfiguration(){
    
   let btn = document.querySelector("#btn-configuration-toggler");
    let configurationSection = document.querySelector("#section-configuration")



    if(btn.innerHTML == "▼"){
        configurationSection.classList.remove("hidden")
        btn.innerHTML = "▲"
    }else{
        btn.innerHTML="▼"
        configurationSection.classList.add("hidden")
    }


}

