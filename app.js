const searchInput=document.getElementById("searchInput");
const levelFilter=document.getElementById("levelFilter");
const typeFilter=document.getElementById("typeFilter");
const cards=[...document.querySelectorAll(".opportunity-card")];
const resultCount=document.getElementById("resultCount");
const emptyState=document.getElementById("emptyState");
function filterOpportunities(){
  const query=searchInput.value.trim().toLowerCase();
  const level=levelFilter.value;
  const type=typeFilter.value;
  let visible=0;
  cards.forEach(card=>{
    const text=(card.dataset.name+" "+card.dataset.tags+" "+card.textContent).toLowerCase();
    const matches=(!query||text.includes(query))&&(!level||card.dataset.level===level||card.dataset.level==="Various levels")&&(!type||card.dataset.type===type);
    card.hidden=!matches;
    if(matches)visible++;
  });
  resultCount.textContent=visible+" programme "+(visible===1?"profile":"profiles");
  emptyState.hidden=visible!==0;
}
document.getElementById("searchButton").addEventListener("click",filterOpportunities);
searchInput.addEventListener("input",filterOpportunities);
levelFilter.addEventListener("change",filterOpportunities);
typeFilter.addEventListener("change",filterOpportunities);
const menuToggle=document.getElementById("menuToggle");
const nav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(open));
});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false")}));
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("interestForm").addEventListener("submit",event=>{
  event.preventDefault();
  document.getElementById("formMessage").textContent="Thanks for your interest. Email registration will be enabled when our secure alert service is connected.";
});
