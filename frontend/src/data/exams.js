// Single source of truth for the catalogue. All records are DEMO data and unverified.
const RAW = {
 engineering:['Engineering Entrance','NTA / State bodies','Intermediate','National',['JEE Main','JEE Advanced','EAPCET / EAMCET','AP EAPCET','TS EAPCET','BITSAT','VITEEE','SRMJEEE','COMEDK','WBJEE','MHT CET','KCET','GUJCET','OJEE','MET','AEEE']],
 medical:['Medical Entrance','NTA / NBEMS / AIIMS','Intermediate','National',['NEET UG','NEET PG','INI CET','AIIMS Nursing','JIPMER Entrance']],
 upsc:['UPSC & Civil Services','UPSC','Graduate','National',['UPSC Civil Services Exam','CDS','NDA','CAPF AC','Engineering Services Exam','Combined Medical Services','EPFO Recruitment (UPSC)','UPSC Geo-Scientist']],
 ssc:['SSC','Staff Selection Commission','Graduate','National',['SSC CGL','SSC CHSL','SSC MTS','SSC GD Constable','SSC CPO','SSC JE','SSC Stenographer','SSC Selection Post','SSC JHT']],
 railway:['Railways / RRB','Railway Recruitment Boards','10th / Graduate','National',['RRB NTPC','RRB Group D','RRB ALP','RRB Technician','RRB JE','RPF Constable','RPF SI']],
 banking:['Banking & Insurance','IBPS / SBI / RBI / NABARD','Graduate','National',['IBPS PO','IBPS Clerk','IBPS SO','IBPS RRB PO','IBPS RRB Clerk','SBI PO','SBI Clerk','SBI SO','RBI Grade B','RBI Assistant','NABARD Grade A','NABARD Grade B','SEBI Grade A','SIDBI Grade A']],
 state:['State Government','State PSCs','Graduate','State',['APPSC Group 1','APPSC Group 2','APPSC Group 3','APPSC Group 4','TSPSC Group 1','TSPSC Group 2','TSPSC Group 3','TSPSC Group 4','State Secretariat Recruitment','Village & Panchayat Recruitment']],
 police:['Police & Defence','State Police / MHA / MoD','10th / Intermediate','State & National',['AP Police Constable','AP Police SI','Telangana Police Constable','Telangana Police SI','CRPF','BSF','CISF','ITBP','SSB','Assam Rifles','Agniveer (Army)','Indian Navy Recruitment','Indian Air Force Recruitment']],
 teaching:['Teaching & Education','CBSE / State / UGC / NTA','Graduate','National & State',['CTET','AP TET','TS TET','UGC NET','CSIR NET','KVS','NVS','DSSSB','State DSC']],
 management:['Management & University','NTA / IIMs / NLUs','Graduate','National',['CAT','XAT','MAT','CMAT','SNAP','NMAT','CUET UG','CUET PG','CLAT','AILET','NIFT','NID DAT','NATA','GATE','JAM','GPAT']],
 board:['School Boards','CBSE / ICSE / State Boards','10th','State & National',['CBSE Class 10','CBSE Class 12','ICSE Class 10','ISC Class 12','AP SSC','AP Intermediate','Telangana SSC','Telangana Intermediate','NIOS']],
 other:['Other Govt & Professional','Various','Graduate','National',['FCI','ESIC','LIC AAO','LIC ADO','NICL AO','NIACL AO','GIC Assistant Manager','India Post','FSSAI','ISRO','DRDO','BARC','CA Foundation','CMA Foundation','CS Executive Entrance']],
 private:['Private Assessments (not public exams)','Individual companies','Graduate','Company',['TCS NQT','Infosys Assessment','Wipro Assessment','Accenture Assessment','Cognizant Assessment','Capgemini Assessment','HCL Assessment','AMCAT','eLitmus','CoCubes']],
};
export const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
export const categories=Object.entries(RAW).map(([id,[label,,,,items]])=>({id,label,count:items.length}));
export const POPULAR=['jee-main','neet-ug','upsc-civil-services-exam','ssc-cgl','ibps-po','rrb-ntpc','gate','cat'];
export const exams=Object.entries(RAW).flatMap(([cat,[label,org,qual,level,items]])=>items.map(name=>({
 id:slug(name),name,category:cat,categoryLabel:label,org,qualification:qual,level,verified:false,userAdded:false,
 state:/^(AP|APPSC)/.test(name)?'Andhra Pradesh':/^(TS|TSPSC|Telangana)/.test(name)?'Telangana':'All India',
 desc:`${name} preparation track (demo information – verify details on the official notification).`})));
