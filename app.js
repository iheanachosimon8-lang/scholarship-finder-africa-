const searchInput=document.getElementById("searchInput");
const levelFilter=document.getElementById("levelFilter");
const typeFilter=document.getElementById("typeFilter");
const cards=[...document.querySelectorAll(".opportunity-card")];
const resultCount=document.getElementById("resultCount");
const emptyState=document.getElementById("emptyState");
function filterOpportunities(){
  const query=searchInput.value.trim().toLowerCase(), level=levelFilter.value, type=typeFilter.value;
  let visible=0;
  cards.forEach(card=>{
    const text=(card.dataset.name+" "+card.dataset.tags+" "+card.textContent).toLowerCase();
    const matches=(!query||text.includes(query))&&(!level||card.dataset.level===level||card.dataset.level==="Various levels")&&(!type||card.dataset.type===type);
    card.hidden=!matches;if(matches)visible++;
  });
  resultCount.textContent=visible+" programme "+(visible===1?"profile":"profiles");
  emptyState.hidden=visible!==0;
}
document.getElementById("searchButton").addEventListener("click",filterOpportunities);
searchInput.addEventListener("input",filterOpportunities);
levelFilter.addEventListener("change",filterOpportunities);
typeFilter.addEventListener("change",filterOpportunities);
const menuToggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open))});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false")}));
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("interestForm").addEventListener("submit",event=>{event.preventDefault();document.getElementById("formMessage").textContent="Thanks for your interest. Email alerts will be enabled in a later release."});

const scholarshipDetails={
  "NNPC TotalEnergies National Merit Scholarship Scheme":{title:"NNPC Limited / TotalEnergies National Merit Scholarship Scheme",overview:"An annual scholarship grant for eligible first-year and second-year full-time Nigerian undergraduates at NUC-accredited universities. Check the provider portal for the current application period.",eligibility:["Nigerian citizen enrolled full-time at an NUC-accredited Nigerian university.","Certified 100-level or 200-level student at the time of application.","UTME score and CGPA requirements apply; confirm the current thresholds on the provider portal.","Students in 300 level or above and current beneficiaries of similar awards may be ineligible."],documents:"Follow the exact document checklist shown in the official online application portal.",steps:["Read the official eligibility rules carefully.","Complete the online application on the official portal.","Upload the requested supporting documents and review before submitting."],deadline:"Application dates can change. Confirm the current deadline on the official portal. Application is free; beware of anyone asking for payment.",source:"https://csr-ngscholarship.totalenergies.com/scholarships/nmss"},
  "NNPC TotalEnergies International Scholarship":{title:"NNPC Limited / TotalEnergies International Scholarship",overview:"A scholarship opportunity for eligible young Nigerian graduates to pursue master's study in France. Confirm the current cycle and course details with the provider.",eligibility:["Be a suitably qualified young Nigerian.","Degree classification and graduation-date requirements apply; check the current official call.","NYSC completion may be required.","Eligible programme areas are specified by the provider for each cycle."],documents:"Use the current official application portal checklist. Confirm all academic and NYSC evidence requirements.",steps:["Read the official programme and eligibility information.","Complete the application through the official scholarship portal only.","Upload all requested documents and submit before the deadline."],deadline:"Application dates and conditions can change. Confirm the current deadline on the provider portal. Applications are free.",source:"https://csr-ngscholarship.totalenergies.com/scholarships/tis"},
  "Commonwealth Shared Scholarships 2027":{title:"Commonwealth Shared Scholarships 2027/28",overview:"Scholarships for eligible students from Commonwealth countries, including Nigeria, to study approved master's courses at participating UK universities.",eligibility:["Be a citizen of or have refugee status in an eligible Commonwealth country, including Nigeria, and meet residence requirements.","Hold an undergraduate honours degree at the required level for the chosen course.","Be unable to afford UK study without the scholarship.","Meet the specific course and participating-university requirements."],documents:"Prepare academic transcripts, references and identity/citizenship evidence. Check the CSC guidance and the selected university's own requirements.",steps:["Choose an approved master's course at a participating UK university.","Apply to the university and follow its admissions process.","Complete the CSC Central application and submit all required documents by the deadline."],deadline:"Check the CSC and participating university pages for the active application deadline.",source:"https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships-applications"},
  "Federal Government Nigerian Scholarship Award":{title:"Federal Government Nigerian Scholarship Award",overview:"The Federal Ministry of Education scholarship portal is the official place to check announcements and application calls. This listing does not claim that a current application round is open.",eligibility:["Eligibility varies by award and application cycle.","Read the official notice for eligible study levels, institutions, academic requirements and required documents."],documents:"Use only the document list published in the relevant official call for applications.",steps:["Visit the Federal Ministry of Education scholarship portal.","Check whether a current application notice is published.","Follow only the instructions and deadlines in that official notice."],deadline:"No current deadline is confirmed in this listing. Check the official portal for the next application call.",source:"https://scholarship.education.gov.ng/"}
};
const dialog=document.getElementById("detailsDialog"),detailsTitle=document.getElementById("detailsTitle"),detailsContent=document.getElementById("detailsContent"),officialLink=document.getElementById("detailsOfficialLink");
function openDetails(card){
  const data=scholarshipDetails[card.dataset.name];
  if(!data){detailsTitle.textContent=card.querySelector("h3").textContent;detailsContent.textContent="Details are being prepared. Please use the official provider link on this card.";officialLink.href=card.querySelector(".card-bottom a").href;dialog.showModal();return;}
  detailsTitle.textContent=data.title;detailsContent.replaceChildren();
  const addSection=(heading,body)=>{const section=document.createElement("section");section.className="detail-section";const h=document.createElement("h3");h.textContent=heading;section.append(h);if(Array.isArray(body)){const ul=document.createElement("ul");body.forEach(item=>{const li=document.createElement("li");li.textContent=item;ul.append(li)});section.append(ul)}else{const p=document.createElement("p");p.textContent=body;section.append(p)}detailsContent.append(section)};
  addSection("Programme overview",data.overview);addSection("Eligibility checklist",data.eligibility);addSection("Documents to prepare",data.documents);addSection("How to apply",data.steps);addSection("Deadline and important notes",data.deadline);
  const note=document.createElement("p");note.className="detail-source-note";note.textContent="Recheck the official source before applying because dates and requirements can change.";detailsContent.append(note);officialLink.href=data.source;dialog.showModal();
}
document.querySelectorAll("[data-details]").forEach(button=>button.addEventListener("click",()=>openDetails(button.closest(".opportunity-card"))));
function closeDetails(){dialog.close()}
document.getElementById("closeDetails").addEventListener("click",closeDetails);
document.getElementById("closeDetailsBottom").addEventListener("click",closeDetails);
dialog.addEventListener("click",event=>{if(event.target===dialog)closeDetails()});

// Supabase student accounts and saved scholarships
const authForm=document.getElementById("authForm"),authMessage=document.getElementById("authMessage");
const signedOut=document.getElementById("authSignedOut"),signedIn=document.getElementById("authSignedIn");
const signedInLabel=document.getElementById("signedInLabel"),savedList=document.getElementById("savedList");
let supabaseClient=null,currentUser=null,savedNames=new Set();
if(window.supabase&&window.SCHOLARSHIP_SUPABASE_URL&&window.SCHOLARSHIP_SUPABASE_PUBLISHABLE_KEY){
  supabaseClient=window.supabase.createClient(window.SCHOLARSHIP_SUPABASE_URL,window.SCHOLARSHIP_SUPABASE_PUBLISHABLE_KEY);
  supabaseClient.auth.getSession().then(({data})=>setUser(data.session?.user||null));
  supabaseClient.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null));
}else if(authMessage){authMessage.textContent="Student accounts are temporarily unavailable. Please try again later."}
function setAuthMessage(message,isError=false){authMessage.textContent=message;authMessage.classList.toggle("error",isError)}
async function setUser(user){
  currentUser=user;signedOut.hidden=!!user;signedIn.hidden=!user;
  document.querySelectorAll("[data-save]").forEach(button=>button.disabled=!user);
  if(user){signedInLabel.textContent="Signed in as "+user.email;await loadSaved()}else{savedNames.clear();renderSaved();document.querySelectorAll("[data-save]").forEach(button=>button.textContent="☆")}
}
async function loadSaved(){
  if(!supabaseClient||!currentUser)return;
  const {data,error}=await supabaseClient.from("saved_scholarships").select("scholarship_name").order("created_at",{ascending:false});
  if(error){setAuthMessage("Your account is signed in, but saved scholarships are not ready yet. Please try again after the database setup.",true);return}
  savedNames=new Set((data||[]).map(row=>row.scholarship_name));renderSaved();updateSaveButtons();
}
function renderSaved(){
  savedList.replaceChildren();
  if(!savedNames.size){const li=document.createElement("li");li.textContent="You have not saved any scholarships yet.";savedList.append(li);return}
  savedNames.forEach(name=>{const li=document.createElement("li");li.textContent=name;savedList.append(li)});
}
function updateSaveButtons(){document.querySelectorAll("[data-save]").forEach(button=>{const card=button.closest(".opportunity-card"),saved=savedNames.has(card.dataset.name);button.textContent=saved?"★":"☆";button.setAttribute("aria-label",saved?"Remove saved scholarship":"Save scholarship")})}
async function handleAuth(mode){
  if(!supabaseClient){setAuthMessage("Account service is not available yet. Refresh the page and try again.",true);return}
  const email=document.getElementById("authEmail").value.trim(),password=document.getElementById("authPassword").value;
  if(!email||password.length<8){setAuthMessage("Enter a valid email and a password of at least 8 characters.",true);return}
  setAuthMessage(mode==="signup"?"Creating your account…":"Signing in…");
  const result=mode==="signup"?await supabaseClient.auth.signUp({email,password}):await supabaseClient.auth.signInWithPassword({email,password});
  if(result.error){setAuthMessage(result.error.message,true);return}
  if(mode==="signup"&&!result.data.session){setAuthMessage("Account created. Check your email for the confirmation link, then return here to sign in.");return}
  setAuthMessage(mode==="signup"?"Your account is ready.":"You are signed in.");
}
authForm.addEventListener("submit",event=>{event.preventDefault();handleAuth("signin")});
document.getElementById("signUpButton").addEventListener("click",()=>handleAuth("signup"));
document.getElementById("signOutButton").addEventListener("click",async()=>{const {error}=await supabaseClient.auth.signOut();if(error)setAuthMessage(error.message,true);else setAuthMessage("You have signed out.")});
document.querySelectorAll("[data-save]").forEach(button=>button.addEventListener("click",async()=>{
  if(!currentUser){document.getElementById("student-account").scrollIntoView({behavior:"smooth"});setAuthMessage("Sign in or create an account before saving scholarships.");return}
  const card=button.closest(".opportunity-card"),name=card.dataset.name,link=card.querySelector(".card-bottom a").href;
  button.disabled=true;
  if(savedNames.has(name)){
    const {error}=await supabaseClient.from("saved_scholarships").delete().eq("scholarship_name",name);
    if(error)setAuthMessage("Could not remove this saved scholarship. Check the database setup.",true);else{savedNames.delete(name);setAuthMessage("Scholarship removed from your saved list.")}
  }else{
    const {error}=await supabaseClient.from("saved_scholarships").insert({scholarship_name:name,official_url:link});
    if(error)setAuthMessage("Could not save this scholarship yet. Check the database setup.",true);else{savedNames.add(name);setAuthMessage("Scholarship saved to your account.")}
  }
  renderSaved();updateSaveButtons();button.disabled=!currentUser;
}));
