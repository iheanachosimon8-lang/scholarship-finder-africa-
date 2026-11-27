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

const scholarshipDetails={
  "NNPC TotalEnergies National Merit Scholarship Scheme":{
    title:"NNPC Limited / TotalEnergies National Merit Scholarship Scheme",
    overview:"An annual scholarship grant for eligible first-year and second-year full-time Nigerian undergraduates at NUC-accredited universities. The official portal lists the 2026/2027 application period as 10 November to 7 December 2026.",
    eligibility:["Nigerian citizen enrolled full-time at an NUC-accredited Nigerian university.","Certified 100-level or 200-level student at the time of application.","UTME score of at least 200.","For 200-level applicants, CGPA of at least 2.5 on a 5.0 scale.","Students in 300 level or above and current beneficiaries of similar oil-and-gas industry awards are not eligible."],
    documents:"Follow the exact document checklist shown in the official online application portal. Upload clear, readable documents.",
    steps:["Read the official eligibility rules carefully.","Complete the online application on the official portal.","Upload the requested supporting documents and review before submitting."],
    deadline:"Official portal currently states: 7 December 2026. Application is free; beware of anyone asking for payment.",
    source:"https://csr-ngscholarship.totalenergies.com/scholarships/nmss"
  },
  "NNPC TotalEnergies International Scholarship":{
    title:"NNPC Limited / TotalEnergies International Scholarship",
    overview:"A full-board scholarship for eligible young Nigerian graduates to pursue master's study at universities in France. The official portal lists the 2027/2028 application period as 3 November 2026 to 31 January 2027.",
    eligibility:["Be a suitably qualified young Nigerian.","Hold a university degree with at least Second Class Upper, obtained no earlier than five years before application.","Have completed the mandatory NYSC scheme.","The programme areas listed by the provider include Management Science, Engineering and Geosciences."],
    documents:"Use the current official application portal checklist. Requirements can include academic and NYSC evidence; confirm the exact documents on the application form.",
    steps:["Read the official programme and eligibility information.","Complete the application through the official scholarship portal only.","Upload all requested documents and submit before the deadline."],
    deadline:"Official portal currently states: 31 January 2027. The provider says applications are free.",
    source:"https://csr-ngscholarship.totalenergies.com/scholarships/tis"
  },
  "Commonwealth Shared Scholarships 2027":{
    title:"Commonwealth Shared Scholarships 2027/28",
    overview:"Scholarships for eligible students from Commonwealth countries, including Nigeria, to study approved master's courses at participating UK universities. The CSC states that study begins in September/October 2027 and the candidate deadline is 8 December 2026 at 16:00 GMT.",
    eligibility:["Be a citizen of or have refugee status in an eligible Commonwealth country, including Nigeria, and meet the residence requirements.","Hold an undergraduate honours degree at the required level for the chosen course.","Be unable to afford UK study without the scholarship.","Meet the specific course and participating-university requirements."],
    documents:"Prepare academic transcripts, references and identity/citizenship evidence. Check the CSC guidance and the selected university's own requirements.",
    steps:["Choose an approved master's course at a participating UK university.","Apply to the university and follow its admissions process.","Complete the CSC Central application and submit all required documents by the deadline."],
    deadline:"CSC candidate deadline: 8 December 2026 at 16:00 GMT. University deadlines and admissions requirements may be earlier.",
    source:"https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships-applications"
  },
  "Federal Government Nigerian Scholarship Award":{
    title:"Federal Government Nigerian Scholarship Award",
    overview:"The Federal Ministry of Education scholarship portal is the official place to check announcements and application calls for Nigerian scholarship awards. This listing does not claim that a current application round is open.",
    eligibility:["Eligibility varies by award and application cycle.","Read the official notice for eligible study levels, institutions, academic requirements and required documents."],
    documents:"Use only the document list published in the relevant official call for applications.",
    steps:["Visit the Federal Ministry of Education scholarship portal.","Check whether a current application notice is published.","Follow only the instructions and deadlines in that official notice."],
    deadline:"No current deadline is confirmed in this listing. Check the official portal for the next application call.",
    source:"https://scholarship.education.gov.ng/"
  }
};
const dialog=document.getElementById("detailsDialog");
const detailsTitle=document.getElementById("detailsTitle");
const detailsContent=document.getElementById("detailsContent");
const officialLink=document.getElementById("detailsOfficialLink");
function openDetails(card){
  const data=scholarshipDetails[card.dataset.name];
  if(!data){detailsTitle.textContent=card.querySelector("h3").textContent;detailsContent.textContent="Details are being prepared. Please use the official provider link on this card.";officialLink.href=card.querySelector(".card-bottom a").href;dialog.showModal();return;}
  detailsTitle.textContent=data.title;
  detailsContent.replaceChildren();
  const addSection=(heading,body)=>{
    const section=document.createElement("section");
    section.className="detail-section";
    const h=document.createElement("h3");h.textContent=heading;section.append(h);
    if(Array.isArray(body)){
      const ul=document.createElement("ul");
      body.forEach(item=>{const li=document.createElement("li");li.textContent=item;ul.append(li)});
      section.append(ul);
    }else{const p=document.createElement("p");p.textContent=body;section.append(p)}
    detailsContent.append(section);
  };
  addSection("Programme overview",data.overview);
  addSection("Eligibility checklist",data.eligibility);
  addSection("Documents to prepare",data.documents);
  addSection("How to apply",data.steps);
  addSection("Deadline and important notes",data.deadline);
  const note=document.createElement("p");note.className="detail-source-note";note.textContent="Information checked against the official provider page. Recheck the source before applying because dates and requirements can change.";
  detailsContent.append(note);
  officialLink.href=data.source;
  dialog.showModal();
}
document.querySelectorAll("[data-details]").forEach(button=>button.addEventListener("click",()=>openDetails(button.closest(".opportunity-card"))));
function closeDetails(){dialog.close()}
document.getElementById("closeDetails").addEventListener("click",closeDetails);
document.getElementById("closeDetailsBottom").addEventListener("click",closeDetails);
dialog.addEventListener("click",event=>{if(event.target===dialog)closeDetails()});
