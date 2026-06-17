// ── Shared Document Autocomplete List ──
// Each entry has: label, kw (keywords for matching), cat (category filter)

export const DOCUMENT_SUGGESTIONS = [

  // ══════════════════════════════════════════
  // AFFIDAVITS / حلف نامے
  // ══════════════════════════════════════════
  { label: "General Affidavit",                         kw: ["aff", "general aff", "halaf"],                              cat: "affidavit" },
  { label: "Property Affidavit",                        kw: ["paff", "property aff", "jaidad aff"],                       cat: "affidavit" },
  { label: "Identity Affidavit",                        kw: ["iaff", "identity aff", "shanaakht"],                        cat: "affidavit" },
  { label: "Surety Affidavit",                          kw: ["saff", "surety aff", "zamaanat aff"],                       cat: "affidavit" },
  { label: "Income Affidavit",                          kw: ["inc aff", "income aff", "aamdani aff"],                     cat: "affidavit" },
  { label: "Character Affidavit",                       kw: ["char aff", "character aff"],                                cat: "affidavit" },
  { label: "Residence Affidavit",                       kw: ["res aff", "rehaish aff"],                                   cat: "affidavit" },
  { label: "Heirship Affidavit",                        kw: ["heir aff", "waris aff"],                                    cat: "affidavit" },
  { label: "Khula Affidavit",                           kw: ["khula aff"],                                                cat: "affidavit" },
  { label: "NOC for Vehicle Transfer",                  kw: ["noc veh", "noc vehicle", "gaadi noc"],                      cat: "affidavit" },
  { label: "NOC Letter",                                kw: ["noc", "no objection"],                                      cat: "affidavit" },
  { label: "Undertaking Letter",                        kw: ["under", "undertaking", "iqrar"],                            cat: "affidavit" },
  { label: "Declaration Affidavit",                     kw: ["decl aff", "declaration aff"],                              cat: "affidavit" },
  { label: "Affidavit of Support",                      kw: ["support aff", "himayat aff"],                               cat: "affidavit" },
  { label: "Affidavit of Ownership",                    kw: ["owner aff", "maalik aff"],                                  cat: "affidavit" },
  { label: "Affidavit of Non-Marriage",                 kw: ["non mar aff", "unmarried aff"],                             cat: "affidavit" },
  { label: "Affidavit of Death",                        kw: ["death aff", "maut aff"],                                    cat: "affidavit" },
  { label: "Affidavit for Name Change",                 kw: ["name change aff", "naam badal"],                            cat: "affidavit" },
  { label: "Affidavit of Unmarried Status",             kw: ["single aff", "kuan aff"],                                   cat: "affidavit" },
  { label: "Nationality Affidavit",                     kw: ["nat aff", "qomiyat aff"],                                   cat: "affidavit" },
  { label: "Student Affidavit",                         kw: ["student aff", "talib aff"],                                 cat: "affidavit" },
  { label: "Sarbrah Khandan Affidavit (Head of Family)", kw: ["sarbrah", "head family", "sarbrah khandan"],               cat: "affidavit" },
  { label: "Family Composition Affidavit (Family Andraj)", kw: ["family andraj", "family comp", "andraj"],               cat: "affidavit" },
  { label: "Not Blacklisted Affidavit (ECNEC)",          kw: ["not black", "black list aff", "ecnec"],                    cat: "affidavit" },
  { label: "Aaq Nama Affidavit (Renunciation)",          kw: ["aaq", "aaq nama", "renunciation"],                         cat: "affidavit" },
  { label: "La Taalukki Affidavit (No Relation)",        kw: ["la taalukki", "no relation aff", "taalukki"],              cat: "affidavit" },
  { label: "Arms / Gun Licence Affidavit",               kw: ["arms lic aff", "gun lic aff", "weapon aff"],               cat: "affidavit" },
  { label: "NOC for Job Affidavit",                      kw: ["noc job", "noc nokri", "job noc aff"],                     cat: "affidavit" },
  { label: "PT1 Property Transfer Affidavit",            kw: ["pt1", "pt 1", "property transfer aff"],                   cat: "affidavit" },
  { label: "Car / Motor Registration Biometric Affidavit", kw: ["car bio", "motor bio", "biometric aff"],                cat: "affidavit" },
  { label: "National Savings Affidavit (Quami Bachat)",  kw: ["mqb", "national sav", "quami bachat"],                    cat: "affidavit" },
  { label: "Damaged Passport Affidavit",                 kw: ["passport dam", "damaged pass aff"],                        cat: "affidavit" },
  { label: "Address Change Affidavit",                   kw: ["address change", "address tabdeel", "tabdeel aff"],        cat: "affidavit" },
  { label: "Birth Certificate Affidavit",                kw: ["birth cert aff", "andraj birth"],                          cat: "affidavit" },
  { label: "College / University Admission Affidavit",   kw: ["admission aff", "college aff", "uni aff"],                 cat: "affidavit" },
  { label: "No Airport / No Departure Affidavit (ECL)",  kw: ["airport aff", "no depart", "ecl aff"],                    cat: "affidavit" },
  { label: "FIR Cancellation Affidavit",                 kw: ["fir cancel", "fir khatam aff"],                            cat: "affidavit" },
  { label: "Gas Connection Affidavit (SNGPL / SSGC)",    kw: ["gas aff", "sngpl aff", "gas sop"],                        cat: "affidavit" },
  { label: "LESCO / Electricity Affidavit",              kw: ["lesco aff", "electricity aff", "bijli aff"],              cat: "affidavit" },
  { label: "Bian Halfi (Sworn Statement)",               kw: ["bian halfi", "sworn state", "halfi bayan"],                cat: "affidavit" },
  { label: "Tasdeeq Nama (Verification Affidavit)",      kw: ["tasdeq", "tasdeeq nama", "verification aff"],             cat: "affidavit" },
  { label: "Warasat Witness Affidavit",                  kw: ["warasat wit", "warasat witness"],                          cat: "affidavit" },
  { label: "Police Bayan Affidavit",                     kw: ["police bayan", "police state aff"],                        cat: "affidavit" },

  // ══════════════════════════════════════════
  // AGREEMENTS / معاہدے
  // ══════════════════════════════════════════
  { label: "Rent Agreement",                            kw: ["re", "rent", "kiraya", "rental"],                           cat: "agreement" },
  { label: "Shop Rent Agreement",                       kw: ["sre", "shop rent", "dukan kiraya"],                         cat: "agreement" },
  { label: "House Rent Agreement",                      kw: ["hre", "house rent", "makan kiraya"],                        cat: "agreement" },
  { label: "Commercial Rent Agreement",                 kw: ["cre", "commercial rent"],                                   cat: "agreement" },
  { label: "Residential Rent Agreement",                kw: ["rre", "residential rent"],                                  cat: "agreement" },
  { label: "Property Sale Agreement",                   kw: ["psa", "property sale", "jaidad bai"],                       cat: "agreement" },
  { label: "Business Partnership Deed",                 kw: ["bpd", "business part", "shirkat deed"],                     cat: "agreement" },
  { label: "Partnership Agreement",                     kw: ["part agree", "shirkat agree"],                              cat: "agreement" },
  { label: "Employment Agreement",                      kw: ["emp agree", "mulazmat agree"],                              cat: "agreement" },
  { label: "Employment Contract",                       kw: ["emp cont", "job contract", "naukri"],                       cat: "agreement" },
  { label: "Service Agreement",                         kw: ["svc", "service agree"],                                     cat: "agreement" },
  { label: "Loan Agreement",                            kw: ["loan", "qarz agree", "lending"],                            cat: "agreement" },
  { label: "NDA - Non-Disclosure Agreement",            kw: ["nda", "non disclosure", "secrecy"],                         cat: "agreement" },
  { label: "MOU - Memorandum of Understanding",         kw: ["mou", "memorandum of under"],                               cat: "agreement" },
  { label: "Joint Venture Agreement",                   kw: ["jv", "joint venture"],                                      cat: "agreement" },
  { label: "Franchise Agreement",                       kw: ["fran", "franchise"],                                        cat: "agreement" },
  { label: "Consultancy Agreement",                     kw: ["cons agree", "consultancy"],                                cat: "agreement" },
  { label: "Supply / Vendor Agreement",                 kw: ["supply", "vendor agree"],                                   cat: "agreement" },
  { label: "Construction Contract",                     kw: ["const cont", "taameer contract"],                           cat: "agreement" },
  { label: "Freelance Agreement",                       kw: ["free", "freelance agree"],                                  cat: "agreement" },
  { label: "Agency Agreement",                          kw: ["agency", "wakeel agree"],                                   cat: "agreement" },
  { label: "Distribution Agreement",                   kw: ["distrib", "taqseem agree"],                                  cat: "agreement" },
  { label: "Shareholders Agreement",                    kw: ["share agree", "hissa agree"],                               cat: "agreement" },
  { label: "Technology / Software Agreement",           kw: ["tech agree", "software agree"],                             cat: "agreement" },
  { label: "Lease Agreement",                           kw: ["lease", "patta agree"],                                     cat: "agreement" },
  { label: "Settlement Agreement",                      kw: ["settle agree", "sulah agree"],                              cat: "agreement" },
  { label: "Iqrar Nama (Declaration Agreement)",        kw: ["iqrar nama", "declaration agree"],                          cat: "agreement" },
  { label: "Iqrar Nama Bee Muhaida (Witnessed Agreement)", kw: ["iqrar bee", "bee muhaida", "witnessed agree"],          cat: "agreement" },
  { label: "Special Karaya Nama (Special Rent Deed)",   kw: ["special karaya", "special rent deed"],                     cat: "agreement" },
  { label: "Sale Deed / Registry (Bai Nama)",           kw: ["sale deed", "registry", "registary", "bai nama"],          cat: "agreement" },
  { label: "Adoption Deed",                             kw: ["adoption deed", "gotcha deed"],                             cat: "agreement" },
  { label: "Abdal Nama (Substitution Deed)",            kw: ["abdal nama", "substitution deed"],                         cat: "agreement" },
  { label: "Compromise Deed (Sulahnama)",               kw: ["sulahnama", "sulah nama", "compromise deed"],               cat: "agreement" },
  { label: "Trust Deed",                                kw: ["trust deed", "trust"],                                      cat: "agreement" },

  // ══════════════════════════════════════════
  // APPLICATIONS / درخواستیں
  // ══════════════════════════════════════════
  { label: "FIR Application to Police Station",         kw: ["fir app", "fir police"],                                    cat: "application" },
  { label: "Bail Application",                          kw: ["bail app", "zamanat app"],                                  cat: "application" },
  { label: "Complaint Against Police Officer",          kw: ["police comp", "complaint police"],                          cat: "application" },
  { label: "Application for NOC from Police",           kw: ["noc police", "noc app police"],                             cat: "application" },
  { label: "Application to Court for Adjournment",      kw: ["adj app", "adjournment app"],                               cat: "application" },
  { label: "Complaint Against Neighbour",               kw: ["neigh comp", "parossi comp"],                               cat: "application" },
  { label: "Application for Character Certificate",     kw: ["char cert app", "aadat cert"],                              cat: "application" },
  { label: "Application to Deputy Commissioner (DC)",   kw: ["dc app", "deputy comm app"],                                cat: "application" },
  { label: "Succession Certificate Application",        kw: ["succ app", "wiraasat cert"],                                cat: "application" },
  { label: "Leave Application",                         kw: ["leave app", "chhutti app"],                                 cat: "application" },
  { label: "Application for Domicile Certificate",      kw: ["dom cert", "domicile app"],                                 cat: "application" },
  { label: "Application for Arms Licence",              kw: ["arms lic", "silah licence"],                                cat: "application" },
  { label: "Complaint to FIA",                          kw: ["fia comp", "fia complaint"],                                cat: "application" },
  { label: "Application to NAB",                        kw: ["nab app", "nab complaint"],                                 cat: "application" },
  { label: "Application to Collector",                  kw: ["collector app", "kolektor"],                                cat: "application" },
  { label: "Application for Utility Connection",        kw: ["utility app", "bijli app"],                                 cat: "application" },
  { label: "Complaint to Ombudsman",                    kw: ["ombuds", "mohtasib"],                                       cat: "application" },
  { label: "Application for Encumbrance Certificate",   kw: ["encumb cert", "rahin cert"],                                cat: "application" },
  { label: "Lost Item / Document Report (Gum Shudgi)",  kw: ["gum shudgi", "gumshudgi", "lost report", "lost document"],  cat: "application" },

  // ══════════════════════════════════════════
  // FAMILY LAW / خاندانی قانون
  // ══════════════════════════════════════════
  { label: "Khula Petition (Divorce by Wife)",          kw: ["khula", "wife divorce", "khula pet"],                       cat: "family-law" },
  { label: "Talaq Nama (Divorce by Husband)",           kw: ["talaq", "talaaq", "husband divorce"],                       cat: "family-law" },
  { label: "First Talaq Notice (1st Divorce Notice)",  kw: ["1st talaq", "first talaq", "pehli talaq", "1 talaq"],       cat: "family-law" },
  { label: "Second Talaq Notice (2nd Divorce Notice)", kw: ["2nd talaq", "second talaq", "doosri talaq", "2 talaq"],     cat: "family-law" },
  { label: "Third Talaq Notice (3rd Divorce Notice)",  kw: ["3rd talaq", "third talaq", "teesri talaq", "3 talaq"],      cat: "family-law" },
  { label: "Mutual Divorce Agreement",                  kw: ["mut div", "mutual divorce", "baahaami talaq"],              cat: "family-law" },
  { label: "Child Custody Petition",                    kw: ["custody", "bachay custody", "custody pet"],                 cat: "family-law" },
  { label: "Maintenance Application (Nafqa)",           kw: ["maint", "nafaqah", "guzara", "nafqa"],                      cat: "family-law" },
  { label: "Nikah Nama (Marriage Contract)",            kw: ["nikah", "nikkah", "shadi", "marriage cont"],               cat: "family-law" },
  { label: "Dissolution of Marriage Suit",              kw: ["diss mar", "shadi khatam"],                                 cat: "family-law" },
  { label: "Haq Mehr Recovery Suit",                    kw: ["haq mehr", "mehr recovery"],                                cat: "family-law" },
  { label: "Guardianship Petition",                     kw: ["guard", "kafalat", "guardian pet"],                         cat: "family-law" },
  { label: "Restitution of Conjugal Rights",            kw: ["restitution", "conjugal", "waapsi haq"],                    cat: "family-law" },
  { label: "Dowry Recovery Application",                kw: ["dowry rec", "jahez recovery"],                              cat: "family-law" },
  { label: "Dowry Agreement / Mehr Settlement",         kw: ["dowry agree", "mehr agree", "jahez"],                       cat: "family-law" },
  { label: "Family Court Application",                  kw: ["fam court", "family court app"],                            cat: "family-law" },
  { label: "Second Marriage Application",               kw: ["2nd mar", "second mar app"],                                cat: "family-law" },
  { label: "Iddat Certificate Application",             kw: ["iddat", "iddat cert"],                                      cat: "family-law" },
  { label: "Child Visitation Rights Application",       kw: ["visit rights", "bachay milna"],                             cat: "family-law" },
  { label: "Aalan La Talaki (Anti-Divorce Declaration)", kw: ["aalan", "la talaki", "anti divorce decl"],               cat: "family-law" },

  // ══════════════════════════════════════════
  // CRIMINAL LAW / فوجداری قانون
  // ══════════════════════════════════════════
  { label: "Bail Application under Section 497 CrPC",  kw: ["bail", "bail 497", "497 bail", "zamanat app"],              cat: "criminal-law" },
  { label: "Anticipatory Bail Application",             kw: ["antici bail", "pre arrest bail"],                           cat: "criminal-law" },
  { label: "Anti-Bail Application",                     kw: ["anti bail", "bail oppose"],                                 cat: "criminal-law" },
  { label: "Bail Petition (High Court)",                kw: ["bail pet", "hc bail"],                                      cat: "criminal-law" },
  { label: "Quashment Petition of FIR",                 kw: ["quash", "fir quash", "qp"],                                 cat: "criminal-law" },
  { label: "FIR Draft",                                 kw: ["fir", "fir draft"],                                         cat: "criminal-law" },
  { label: "Criminal Appeal Against Conviction",        kw: ["crim appeal", "conviction appeal"],                         cat: "criminal-law" },
  { label: "Surety Bond Application",                   kw: ["surety bond", "zamanat bond"],                              cat: "criminal-law" },
  { label: "Written Complaint under Section 200 CrPC",  kw: ["200 comp", "sec 200", "s200"],                              cat: "criminal-law" },
  { label: "Acquittal Application",                     kw: ["acquit", "bari", "acquittal"],                              cat: "criminal-law" },
  { label: "Revision Petition (Criminal)",              kw: ["rev pet", "criminal revision"],                             cat: "criminal-law" },
  { label: "Criminal Complaint (Shikayat)",             kw: ["crim comp", "shikayat"],                                    cat: "criminal-law" },
  { label: "Plea Bargain Application",                  kw: ["plea", "saza tasmim"],                                      cat: "criminal-law" },
  { label: "Parole Application",                        kw: ["parole", "reeha application"],                              cat: "criminal-law" },
  { label: "Probation Application",                     kw: ["probation", "probation app"],                               cat: "criminal-law" },
  { label: "Dishonour of Cheque Case (Section 489-F PPC)", kw: ["489f", "489 f", "cheque dishonour", "cheque bounce", "check bounce"], cat: "criminal-law" },
  { label: "Anti-Terrorism Court (ATC) Bail Application", kw: ["atc bail", "anti terrorism", "terrorism bail", "atc"],     cat: "criminal-law" },
  { label: "Narcotics (CNSA) Bail Application",          kw: ["narcotics bail", "cnsa", "drug bail", "narcotic"],          cat: "criminal-law" },
  { label: "Cybercrime Complaint (PECA / FIA)",          kw: ["cyber", "peca", "cyber crime", "fia cyber"],                cat: "criminal-law" },
  { label: "Defamation Complaint (Hatak-e-Izzat)",       kw: ["defamation crim", "hatak izzat", "hatak"],                 cat: "criminal-law" },

  // ══════════════════════════════════════════
  // PROPERTY LAW / جائیداد قانون
  // ══════════════════════════════════════════
  { label: "Suit for Possession of Property",           kw: ["poss suit", "qabza suit"],                                  cat: "property-law" },
  { label: "Injunction Against Illegal Construction",   kw: ["inj const", "taameer rok"],                                 cat: "property-law" },
  { label: "Property Dispute / Trespass Case",          kw: ["prop dispute", "jaidad dispute"],                           cat: "property-law" },
  { label: "Inheritance / Wirasat Suit",                kw: ["inherit", "wirasat suit", "heir suit"],                     cat: "property-law" },
  { label: "Rent Recovery from Tenant",                 kw: ["rent rec", "kiraya recovery"],                              cat: "property-law" },
  { label: "Declaratory Suit for Ownership",            kw: ["decl suit", "maalik suit"],                                 cat: "property-law" },
  { label: "Pre-emption (Shuf'a) Suit",                 kw: ["preemption", "shufa"],                                      cat: "property-law" },
  { label: "Specific Performance of Sale Deed",         kw: ["spec perf", "bai specific"],                                cat: "property-law" },
  { label: "Sale Deed",                                 kw: ["sd", "sale deed", "bai nama"],                              cat: "property-law" },
  { label: "Gift Deed (Hiba Nama)",                     kw: ["gift", "hiba nama"],                                        cat: "property-law" },
  { label: "Mortgage Deed (Rahn Nama)",                 kw: ["mortgage", "girwi", "rahn"],                                cat: "property-law" },
  { label: "Mutation Application (Intiqal)",            kw: ["mut app", "intiqal", "mutation"],                           cat: "property-law" },
  { label: "Transfer Letter",                           kw: ["transfer let", "intiqal khat"],                             cat: "property-law" },
  { label: "Eviction Suit Against Tenant",              kw: ["evict suit", "kiraya khatam"],                              cat: "property-law" },
  { label: "Partition Suit",                            kw: ["partition", "taqseem suit"],                                cat: "property-law" },
  { label: "Property Registration Application",         kw: ["prop reg", "jaidad reg"],                                   cat: "property-law" },
  { label: "Will (Wasiyat Nama)",                       kw: ["will", "wasiyat", "wasiyat nama"],                          cat: "property-law" },
  { label: "Family Transfer Deed (Tamleek Nama)",       kw: ["tamleek", "tamleek nama", "family transfer"],               cat: "property-law" },

  // ══════════════════════════════════════════
  // CIVIL LAW / دیوانی قانون
  // ══════════════════════════════════════════
  { label: "Civil Suit for Money Recovery",             kw: ["money suit", "paisay suit", "recovery suit"],               cat: "civil-law" },
  { label: "Specific Performance Suit",                 kw: ["spec perf suit"],                                           cat: "civil-law" },
  { label: "Declaratory Suit",                          kw: ["decl suit civ", "declaration suit"],                        cat: "civil-law" },
  { label: "Injunction Application",                    kw: ["inj app", "stay order", "tawaquf"],                         cat: "civil-law" },
  { label: "Written Statement / Jawab Dawa",            kw: ["ws", "written state", "jawab dawa"],                        cat: "civil-law" },
  { label: "Civil Appeal",                              kw: ["civil appeal", "civ appeal"],                               cat: "civil-law" },
  { label: "Execution Petition",                        kw: ["exec pet", "tanfiz"],                                       cat: "civil-law" },
  { label: "Damages Suit",                              kw: ["damage suit", "nuqsaan suit"],                              cat: "civil-law" },
  { label: "Plaint (Dawa)",                             kw: ["plaint", "dawa"],                                           cat: "civil-law" },
  { label: "Revision Petition (Civil)",                 kw: ["civ rev", "civil revision"],                                cat: "civil-law" },
  { label: "Interim Application",                       kw: ["interim app", "waqti app"],                                 cat: "civil-law" },
  { label: "Suit for Breach of Contract",               kw: ["breach suit", "contract breach"],                           cat: "civil-law" },
  { label: "Banking Recovery Suit (FIO 2001)",           kw: ["banking suit", "bank recovery", "financial institution", "fio"], cat: "civil-law" },
  { label: "Consumer Court Complaint",                   kw: ["consumer comp", "consumer court", "consumer protection"],   cat: "civil-law" },
  { label: "Defamation Suit (Hatak-e-Izzat)",            kw: ["defamation", "hatak izzat suit", "izzat suit"],            cat: "civil-law" },
  { label: "Caveat Petition",                            kw: ["caveat"],                                                   cat: "civil-law" },
  { label: "Probate / Letters of Administration",        kw: ["probate", "letters admin", "administration"],              cat: "civil-law" },

  // ══════════════════════════════════════════
  // CORPORATE LAW / کارپوریٹ قانون
  // ══════════════════════════════════════════
  { label: "Partnership Dispute Petition",              kw: ["part dispute", "shirkat dispute"],                          cat: "corporate-law" },
  { label: "Wrongful Dismissal / Termination Case",     kw: ["wrongful dismiss", "termination case", "nukaala"],          cat: "corporate-law" },
  { label: "Business Contract Dispute",                 kw: ["biz dispute", "contract dispute"],                          cat: "corporate-law" },
  { label: "Shareholder Dispute Petition",              kw: ["share dispute", "hissa dispute"],                           cat: "corporate-law" },
  { label: "Company Winding Up Petition",               kw: ["wind up", "winding", "company close"],                      cat: "corporate-law" },
  { label: "Director Removal Application",              kw: ["director remove", "dir removal"],                           cat: "corporate-law" },
  { label: "Intellectual Property Dispute",             kw: ["ip dispute", "copyright dispute"],                          cat: "corporate-law" },
  { label: "Non-Compete Breach Case",                   kw: ["non compete", "comp breach"],                               cat: "corporate-law" },
  { label: "Partnership Deed",                          kw: ["partner deed", "shirkat deed"],                             cat: "corporate-law" },
  { label: "Board Resolution",                          kw: ["board res", "brd res"],                                     cat: "corporate-law" },
  { label: "Memorandum of Association (MOA)",           kw: ["moa", "memo assoc"],                                        cat: "corporate-law" },
  { label: "Articles of Association (AOA)",             kw: ["aoa", "articles assoc"],                                    cat: "corporate-law" },
  { label: "Share Transfer Agreement",                  kw: ["share trans", "hissa transfer"],                            cat: "corporate-law" },
  { label: "Employment Termination Letter",             kw: ["term letter", "nukaala letter"],                            cat: "corporate-law" },
  { label: "Labour Court Grievance Petition",            kw: ["labour court", "labor grievance", "labour grievance"],      cat: "corporate-law" },
  { label: "NIRC Petition (Industrial Relations)",       kw: ["nirc", "industrial relations", "industrial dispute"],       cat: "corporate-law" },

  // ══════════════════════════════════════════
  // TAX LAW / ٹیکس قانون
  // ══════════════════════════════════════════
  { label: "Income Tax Appeal before ATIR",             kw: ["income tax appeal", "atir appeal", "tax appeal"],           cat: "tax-law" },
  { label: "Sales Tax Dispute Petition",                kw: ["sales tax", "sales tax dispute"],                           cat: "tax-law" },
  { label: "Tax Exemption Application",                 kw: ["tax exempt", "tax chhoot"],                                 cat: "tax-law" },
  { label: "FBR Notice Reply",                          kw: ["fbr notice", "fbr reply"],                                  cat: "tax-law" },
  { label: "Customs Duty Appeal",                       kw: ["customs appeal", "duty appeal"],                            cat: "tax-law" },
  { label: "Tax Refund Application",                    kw: ["tax refund", "waapsi tax"],                                 cat: "tax-law" },
  { label: "Penalty Waiver Application",                kw: ["penalty waiver", "jarimana maafi"],                         cat: "tax-law" },
  { label: "Transfer Pricing Dispute",                  kw: ["transfer pricing", "tp dispute"],                           cat: "tax-law" },
  { label: "Withholding Tax Application",               kw: ["wht app", "withholding tax"],                               cat: "tax-law" },
  { label: "Income Tax Return Objection",               kw: ["itr obj", "return object"],                                 cat: "tax-law" },
  { label: "Tax Audit Reply",                           kw: ["audit reply", "tax audit"],                                 cat: "tax-law" },

  // ══════════════════════════════════════════
  // IMMIGRATION LAW / امیگریشن قانون
  // ══════════════════════════════════════════
  { label: "Visa Appeal Petition",                      kw: ["visa appeal", "visa reject"],                               cat: "immigration-law" },
  { label: "Citizenship Application",                   kw: ["citizen app", "shahriyat"],                                 cat: "immigration-law" },
  { label: "Deportation Stay Application",              kw: ["deport stay", "deportation"],                               cat: "immigration-law" },
  { label: "Work Permit Appeal",                        kw: ["work permit", "kam permit"],                                cat: "immigration-law" },
  { label: "Asylum / Refugee Status Application",       kw: ["asylum", "refugee", "panah"],                               cat: "immigration-law" },
  { label: "Travel Document Application",               kw: ["travel doc", "safar doc"],                                  cat: "immigration-law" },
  { label: "Dual Nationality Application",              kw: ["dual nat", "dohri nationality"],                            cat: "immigration-law" },
  { label: "Overstay Regularization Petition",          kw: ["overstay", "ziada raho"],                                   cat: "immigration-law" },
  { label: "Passport Application / Renewal",            kw: ["passport", "passport renew"],                               cat: "immigration-law" },
  { label: "Family Reunion Visa Application",           kw: ["family visa", "ghar wala visa"],                            cat: "immigration-law" },
  { label: "Student Visa Application",                  kw: ["student visa", "talib visa"],                               cat: "immigration-law" },

  // ══════════════════════════════════════════
  // CONSTITUTIONAL LAW / آئینی قانون
  // ══════════════════════════════════════════
  { label: "Writ Petition under Article 199",           kw: ["writ", "wp", "art 199"],                                    cat: "constitutional-law" },
  { label: "Fundamental Rights Petition",               kw: ["fund rights", "bunyadi haqooq"],                            cat: "constitutional-law" },
  { label: "Habeas Corpus Petition",                    kw: ["habeas", "hbc", "corpus"],                                  cat: "constitutional-law" },
  { label: "Mandamus Application",                      kw: ["mandamus", "man app"],                                      cat: "constitutional-law" },
  { label: "Quo Warranto Petition",                     kw: ["quo war", "qw"],                                            cat: "constitutional-law" },
  { label: "Certiorari Petition",                       kw: ["certiorari", "cert pet"],                                   cat: "constitutional-law" },
  { label: "Constitutional Petition Against Government",kw: ["const pet", "cp", "govt petition"],                         cat: "constitutional-law" },
  { label: "Service Matter Writ Petition",              kw: ["service writ", "mulazmat writ"],                            cat: "constitutional-law" },
  { label: "Contempt of Court Application",             kw: ["contempt", "tohin adalat"],                                 cat: "constitutional-law" },
  { label: "Suo Motu Application",                      kw: ["suo motu", "khud notice"],                                  cat: "constitutional-law" },
  { label: "Review Petition (Supreme Court)",           kw: ["sc review", "supreme review"],                              cat: "constitutional-law" },

  // ══════════════════════════════════════════
  // NON-MUSLIM LAWS / غیر مسلم قوانین
  // ══════════════════════════════════════════
  { label: "Christian Divorce Petition",                kw: ["christian div", "isaai talaq"],                             cat: "non-muslim-laws" },
  { label: "Hindu Marriage Registration",               kw: ["hindu mar", "hindu shadi"],                                 cat: "non-muslim-laws" },
  { label: "Non-Muslim Succession / Inheritance Case",  kw: ["non muslim succ", "minority inherit"],                      cat: "non-muslim-laws" },
  { label: "Minority Community Rights Petition",        kw: ["minority rights", "aqaliat rights"],                        cat: "non-muslim-laws" },
  { label: "Inter-Faith Marriage Documents",            kw: ["interfaith mar", "mix shadi"],                              cat: "non-muslim-laws" },
  { label: "Christian Marriage Registration",           kw: ["christian mar", "isaai shadi"],                             cat: "non-muslim-laws" },
  { label: "Sikh Community Legal Matter",               kw: ["sikh", "sikh legal"],                                       cat: "non-muslim-laws" },
  { label: "Hindu Divorce Petition",                    kw: ["hindu div", "hindu talaq"],                                 cat: "non-muslim-laws" },
  { label: "Parsi Marriage / Divorce Matter",           kw: ["parsi", "parsi mar"],                                       cat: "non-muslim-laws" },

  // ══════════════════════════════════════════
  // POWER OF ATTORNEY / پاور آف اٹارنی
  // ══════════════════════════════════════════
  { label: "General Power of Attorney",                 kw: ["gpa", "general poa", "mukhtarnaama aam"],                   cat: "power-of-attorney" },
  { label: "Special Power of Attorney for Property",    kw: ["spa prop", "property poa", "jaidad mukhtarnaama"],          cat: "power-of-attorney" },
  { label: "Court Appearance Power of Attorney",        kw: ["court poa", "adalat mukhtarnaama"],                         cat: "power-of-attorney" },
  { label: "Banking / Financial Power of Attorney",     kw: ["bank poa", "financial poa"],                               cat: "power-of-attorney" },
  { label: "Revocation of Power of Attorney",           kw: ["revoke poa", "mukhtarnaama cancel"],                        cat: "power-of-attorney" },
  { label: "Power of Attorney for Overseas Pakistani",  kw: ["overseas poa", "bahar poa", "bahar wala"],                  cat: "power-of-attorney" },
  { label: "Limited Power of Attorney",                 kw: ["lpa", "limited poa"],                                       cat: "power-of-attorney" },
  { label: "Medical Power of Attorney",                 kw: ["medical poa", "sihat poa"],                                 cat: "power-of-attorney" },
  { label: "Business Power of Attorney",                kw: ["biz poa", "karobaar mukhtarnaama"],                         cat: "power-of-attorney" },
  { label: "Minor's Power of Attorney",                 kw: ["minor poa", "bachay poa"],                                  cat: "power-of-attorney" },

  // ══════════════════════════════════════════
  // COURT CASES (mixed — shown on court-cases page)
  // ══════════════════════════════════════════
  { label: "Bail Application",                          kw: ["bail app", "zamanat app"],                                  cat: "court-cases" },
  { label: "Civil Petition for Property Dispute",       kw: ["civil pet prop", "property civil pet"],                     cat: "court-cases" },
  { label: "Written Statement / Jawab Dawa",            kw: ["ws", "jawab dawa"],                                         cat: "court-cases" },
  { label: "Legal Notice for Loan Recovery",            kw: ["notice loan", "qarz notice"],                               cat: "court-cases" },
  { label: "Writ Petition under Article 199",           kw: ["writ", "wp"],                                               cat: "court-cases" },
  { label: "Criminal Complaint under Section 200",      kw: ["200 comp", "s200"],                                         cat: "court-cases" },
  { label: "Appeal Against Lower Court Judgment",       kw: ["appeal judg", "lower court appeal"],                        cat: "court-cases" },
  { label: "FIR Draft",                                 kw: ["fir", "fir draft"],                                         cat: "court-cases" },
  { label: "Legal Notice",                              kw: ["legal notice", "qanooni notice"],                            cat: "court-cases" },
  { label: "Eviction Notice",                           kw: ["evict", "nikalo notice"],                                   cat: "court-cases" },
  { label: "Default / Demand Notice",                   kw: ["default notice", "demand notice"],                          cat: "court-cases" },
  { label: "First Appeal",                              kw: ["first appeal", "istinaf"],                                  cat: "court-cases" },
  { label: "Second Appeal",                             kw: ["second appeal", "2nd appeal"],                              cat: "court-cases" },
  { label: "Review Petition",                           kw: ["review pet"],                                               cat: "court-cases" },
  { label: "Dishonour of Cheque Case (Section 489-F PPC)", kw: ["489f", "489 f", "cheque dishonour", "cheque bounce"],    cat: "court-cases" },
  { label: "Banking Recovery Suit (FIO 2001)",          kw: ["banking suit", "bank recovery", "fio"],                     cat: "court-cases" },
  { label: "Consumer Court Complaint",                  kw: ["consumer comp", "consumer court"],                          cat: "court-cases" },
  { label: "Defamation Suit (Hatak-e-Izzat)",           kw: ["defamation", "hatak izzat"],                                cat: "court-cases" },
  { label: "Cybercrime Complaint (PECA / FIA)",         kw: ["cyber", "peca", "cyber crime"],                             cat: "court-cases" },
];

export function getDocSuggestions(
  val: string,
  filterCat?: string
): typeof DOCUMENT_SUGGESTIONS {
  const q = val.trim().toLowerCase();

  const pool = filterCat
    ? DOCUMENT_SUGGESTIONS.filter(d => d.cat === filterCat)
    : DOCUMENT_SUGGESTIONS;

  // Empty / very short input: on a category page, list every document in that
  // category so the user can browse all available cases. Without a category we
  // stay quiet (no point dumping the whole list).
  if (q.length < 2) {
    return filterCat ? pool : [];
  }
  if (q.length > 35) return [];

  return pool.filter(doc => {
    if (doc.label.toLowerCase().includes(q)) return true;
    if (doc.kw.some(k => k.startsWith(q))) return true;
    if (doc.label.toLowerCase().split(/[\s\-()/,]+/).some(w => w.length > 1 && w.startsWith(q))) return true;
    return false;
  }).slice(0, 12);
}
