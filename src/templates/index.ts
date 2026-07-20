import { TemplateDefinition } from "./types";

// Affidavits
import { declarationAffidavit } from "./affidavits/declaration";
import { nocAffidavit } from "./affidavits/noc";
import { indemnityBond } from "./affidavits/indemnity-bond";
import { birthCertificateAffidavit } from "./affidavits/birth-certificate";
import { deathCertificateAffidavit } from "./affidavits/death-certificate";
import { firCancelAffidavit } from "./affidavits/fir-cancel";
import { supportAffidavit } from "./affidavits/support-affidavit";
import { necAffidavit } from "./affidavits/nec";
import { nameCorrectionAffidavit } from "./affidavits/name-correction";
import { domicileAffidavit } from "./affidavits/domicile";
import { characterCertificateAffidavit } from "./affidavits/character-certificate";
import { incomeCertificateAffidavit } from "./affidavits/income-certificate";
import { unmarriedCertificateAffidavit } from "./affidavits/unmarried-certificate";
import { gapCertificateAffidavit } from "./affidavits/gap-certificate";
import { lostDocumentAffidavit } from "./affidavits/lost-document";
import { heirshipAffidavit } from "./affidavits/heirship";
import { vehicleOwnershipAffidavit } from "./affidavits/vehicle-ownership";
import { propertyOwnershipAffidavit } from "./affidavits/property-ownership";
import { samePersonAffidavit } from "./affidavits/same-person";
import { ageDeclarationAffidavit } from "./affidavits/age-declaration";
import { residenceAffidavit } from "./affidavits/residence";
import { employmentAffidavit } from "./affidavits/employment";
import { loanRecoveryAffidavit } from "./affidavits/loan-recovery";
import { tenantEvictionAffidavit } from "./affidavits/tenant-eviction";
import { powerDisconnectionAffidavit } from "./affidavits/power-disconnection";
import { schoolLeavingAffidavit } from "./affidavits/school-leaving";
import { oathAffidavit } from "./affidavits/oath-affidavit";
import { suretyBondAffidavit } from "./affidavits/surety-bond";
import { divorceAffidavit } from "./affidavits/divorce-affidavit";
import { nationalityAffidavit } from "./affidavits/nationality-affidavit";
import { conversionAffidavit } from "./affidavits/conversion-affidavit";
import { pensionAffidavit } from "./affidavits/pension-affidavit";
import { insuranceClaimAffidavit } from "./affidavits/insurance-claim";
import { passportAffidavit } from "./affidavits/passport-affidavit";
import { educationAffidavit } from "./affidavits/education-affidavit";
import { marriageAffidavit } from "./affidavits/marriage-affidavit";
import { businessRegistrationAffidavit } from "./affidavits/business-registration";
import { propertyDisputeAffidavit } from "./affidavits/property-dispute";
import { cnicAffidavit } from "./affidavits/cnic-affidavit";
import { bankAffidavit } from "./affidavits/bank-affidavit";
import { tenantVerificationAffidavit } from "./affidavits/tenant-verification";
import { immigrationAffidavit } from "./affidavits/immigration-affidavit";
import { noDemandAffidavit } from "./affidavits/no-demand";
import { undertakingAffidavit } from "./affidavits/undertaking-affidavit";
import { customAffidavit } from "./affidavits/custom-affidavit";

// Agreements
import { saleDeed } from "./agreements/sale-deed";
import { rentAgreement } from "./agreements/rent-agreement";
import { partnershipDeed } from "./agreements/partnership-deed";
import { employmentContract } from "./agreements/employment-contract";
import { serviceAgreement } from "./agreements/service-agreement";
import { loanAgreement } from "./agreements/loan-agreement";
import { leaseAgreement } from "./agreements/lease-agreement";
import { franchiseAgreement } from "./agreements/franchise-agreement";
import { jointVenture } from "./agreements/joint-venture";
import { nonDisclosure } from "./agreements/non-disclosure";
import { mouAgreement } from "./agreements/mou";
import { constructionContract } from "./agreements/construction-contract";
import { vehicleSale } from "./agreements/vehicle-sale";
import { propertyAgreement } from "./agreements/property-agreement";
import { divorceSettlement } from "./agreements/divorce-settlement";
import { businessSale } from "./agreements/business-sale";
import { contractLabor } from "./agreements/contract-labor";
import { tenancyTermination } from "./agreements/tenancy-termination";
import { powerSharing } from "./agreements/power-sharing";
import { willWasiyat } from "./agreements/will-wasiyat";
import { giftDeed } from "./agreements/gift-deed";
import { mortgageDeed } from "./agreements/mortgage-deed";
import { surrenderDeed } from "./agreements/surrender-deed";
import { exchangeDeed } from "./agreements/exchange-deed";
import { cancellationDeed } from "./agreements/cancellation-deed";
import { rectificationDeed } from "./agreements/rectification-deed";
import { releaseDeed } from "./agreements/release-deed";
import { pledgeAgreement } from "./agreements/pledge-agreement";
import { agencyAgreement } from "./agreements/agency-agreement";
import { distributionAgreement } from "./agreements/distribution-agreement";
import { subContract } from "./agreements/sub-contract";
import { landPartition } from "./agreements/land-partition";
import { shopRent } from "./agreements/shop-rent";
import { agriculturalLease } from "./agreements/agricultural-lease";
import { guarantorAgreement } from "./agreements/guarantor-agreement";
import { settlementDeed } from "./agreements/settlement-deed";
import { licenseAgreement } from "./agreements/license-agreement";
import { indemnityAgreement } from "./agreements/indemnity-agreement";
import { arbitrationAgreement } from "./agreements/arbitration-agreement";
import { escrowAgreement } from "./agreements/escrow-agreement";
import { customAgreement } from "./agreements/custom-agreement";

// Power of Attorney
import { generalPOA } from "./power-of-attorney/general";
import { specialCourtPOA } from "./power-of-attorney/special-court";
import { vakalatnama } from "./power-of-attorney/vakalatnama";

// Family Law
import { divorceDeed } from "./family-law/divorce-deed";
import { marriageDeed } from "./family-law/marriage-deed";
import { adoptionDeed } from "./family-law/adoption-deed";
import { khula } from "./family-law/khula";
import { maintenance } from "./family-law/maintenance";
import { childCustody } from "./family-law/child-custody";
import { guardianship } from "./family-law/guardianship";
import { successionCertificate } from "./family-law/succession-certificate";
import { inheritance } from "./family-law/inheritance";
import { restitutionConjugalRights } from "./family-law/restitution-conjugal-rights";
import { domesticViolence } from "./family-law/domestic-violence";
import { mehrRecovery } from "./family-law/mehr-recovery";
import { visitationRights } from "./family-law/visitation-rights";
import { secondMarriagePermission } from "./family-law/second-marriage-permission";
import { familySettlement } from "./family-law/family-settlement";
import { dowerDeed } from "./family-law/dower-deed";

// Applications
import { policeStationApplication } from "./applications/police-station";
import { generalApplication } from "./applications/general-application";

// Civil Law
import { legalNotice } from "./civil-law/legal-notice";
import { moneyRecovery } from "./civil-law/money-recovery";
import { breachOfContract } from "./civil-law/breach-of-contract";
import { consumerComplaint } from "./civil-law/consumer-complaint";
import { defamationSuit } from "./civil-law/defamation-suit";
import { arbitrationApplication } from "./civil-law/arbitration-application";
import { stayOrder } from "./civil-law/stay-order";

// Corporate Law
import { companyRegistration } from "./corporate-law/company-registration";
import { partnershipRegistration } from "./corporate-law/partnership-registration";
import { shareholderAgreement } from "./corporate-law/shareholder-agreement";
import { boardResolution } from "./corporate-law/board-resolution";
import { windingUpPetition } from "./corporate-law/winding-up-petition";

// Tax Law
import { taxAppeal } from "./tax-law/tax-appeal";
import { taxExemption } from "./tax-law/tax-exemption";
import { fbrComplaint } from "./tax-law/fbr-complaint";
import { withholdingCertificate } from "./tax-law/withholding-certificate";

// Immigration Law
import { visaApplication } from "./immigration-law/visa-application";
import { passportApplication } from "./immigration-law/passport-application";
import { nicopApplication } from "./immigration-law/nicop-application";
import { citizenshipApplication } from "./immigration-law/citizenship-application";
import { deportationDefense } from "./immigration-law/deportation-defense";

// Constitutional Law
import { writPetition } from "./constitutional-law/writ-petition";
import { fundamentalRights } from "./constitutional-law/fundamental-rights";
import { habeasCorpus } from "./constitutional-law/habeas-corpus";
import { contemptPetition } from "./constitutional-law/contempt-petition";

// Criminal Law
import { bailApplication } from "./criminal-law/bail-application";
import { firRegistration } from "./criminal-law/fir-registration";
import { quashmentPetition } from "./criminal-law/quashment-petition";
import { murderDefense } from "./criminal-law/murder-defense";
import { fraudCheating } from "./criminal-law/fraud-cheating";
import { cyberCrime } from "./criminal-law/cyber-crime";
import { challanResponse } from "./criminal-law/challan-response";
import { appealPetition } from "./criminal-law/appeal-petition";
import { complaintPetition } from "./criminal-law/complaint-petition";
import { anticipatoryBail } from "./criminal-law/anticipatory-bail";

// Property Law
import { possessionSuit } from "./property-law/possession-suit";
import { illegalDispossession } from "./property-law/illegal-dispossession";
import { mutationApplication } from "./property-law/mutation-application";
import { rentDispute } from "./property-law/rent-dispute";
import { partitionSuit } from "./property-law/partition-suit";
import { specificPerformance } from "./property-law/specific-performance";
import { injunctionApplication } from "./property-law/injunction-application";
import { titleSuit } from "./property-law/title-suit";
import { landRevenue } from "./property-law/land-revenue";
import { propertyTransferDeed } from "./property-law/property-transfer-deed";

// Non-Muslim Laws
import { christianMarriage } from "./non-muslim-laws/christian-marriage";
import { christianDivorce } from "./non-muslim-laws/christian-divorce";
import { christianCustody } from "./non-muslim-laws/christian-custody";
import { hinduMarriage } from "./non-muslim-laws/hindu-marriage";
import { hinduDivorce } from "./non-muslim-laws/hindu-divorce";
import { nonMuslimSuccession } from "./non-muslim-laws/succession-certificate";
import { nonMuslimGuardianship } from "./non-muslim-laws/guardianship";
import { nonMuslimMaintenance } from "./non-muslim-laws/maintenance";
import { parsiMarriage } from "./non-muslim-laws/parsi-marriage";
import { sikhMarriage } from "./non-muslim-laws/sikh-marriage";
import { minorityRightsPetition } from "./non-muslim-laws/minority-rights-petition";
import { forcedConversionComplaint } from "./non-muslim-laws/forced-conversion";
import { worshipPlaceProtection } from "./non-muslim-laws/worship-place-protection";
import { blasphemyDefense } from "./non-muslim-laws/blasphemy-defense";
import { religiousProperty } from "./non-muslim-laws/religious-property";
import { interfaithMarriage } from "./non-muslim-laws/interfaith-marriage";
import { discriminationComplaint } from "./non-muslim-laws/discrimination-complaint";

const allTemplates: TemplateDefinition[] = [
  // Affidavits
  declarationAffidavit,
  nocAffidavit,
  indemnityBond,
  birthCertificateAffidavit,
  deathCertificateAffidavit,
  firCancelAffidavit,
  supportAffidavit,
  necAffidavit,
  nameCorrectionAffidavit,
  domicileAffidavit,
  characterCertificateAffidavit,
  incomeCertificateAffidavit,
  unmarriedCertificateAffidavit,
  gapCertificateAffidavit,
  lostDocumentAffidavit,
  heirshipAffidavit,
  vehicleOwnershipAffidavit,
  propertyOwnershipAffidavit,
  samePersonAffidavit,
  ageDeclarationAffidavit,
  residenceAffidavit,
  employmentAffidavit,
  loanRecoveryAffidavit,
  tenantEvictionAffidavit,
  powerDisconnectionAffidavit,
  schoolLeavingAffidavit,
  oathAffidavit,
  suretyBondAffidavit,
  divorceAffidavit,
  nationalityAffidavit,
  conversionAffidavit,
  pensionAffidavit,
  insuranceClaimAffidavit,
  passportAffidavit,
  educationAffidavit,
  marriageAffidavit,
  businessRegistrationAffidavit,
  propertyDisputeAffidavit,
  cnicAffidavit,
  bankAffidavit,
  tenantVerificationAffidavit,
  immigrationAffidavit,
  noDemandAffidavit,
  undertakingAffidavit,
  customAffidavit,
  // Agreements
  saleDeed,
  rentAgreement,
  partnershipDeed,
  employmentContract,
  serviceAgreement,
  loanAgreement,
  leaseAgreement,
  franchiseAgreement,
  jointVenture,
  nonDisclosure,
  mouAgreement,
  constructionContract,
  vehicleSale,
  propertyAgreement,
  divorceSettlement,
  businessSale,
  contractLabor,
  tenancyTermination,
  powerSharing,
  willWasiyat,
  giftDeed,
  mortgageDeed,
  surrenderDeed,
  exchangeDeed,
  cancellationDeed,
  rectificationDeed,
  releaseDeed,
  pledgeAgreement,
  agencyAgreement,
  distributionAgreement,
  subContract,
  landPartition,
  shopRent,
  agriculturalLease,
  guarantorAgreement,
  settlementDeed,
  licenseAgreement,
  indemnityAgreement,
  arbitrationAgreement,
  escrowAgreement,
  customAgreement,
  // Power of Attorney
  generalPOA,
  specialCourtPOA,
  vakalatnama,
  // Family Law
  divorceDeed,
  marriageDeed,
  adoptionDeed,
  khula,
  maintenance,
  childCustody,
  guardianship,
  successionCertificate,
  inheritance,
  restitutionConjugalRights,
  domesticViolence,
  mehrRecovery,
  visitationRights,
  secondMarriagePermission,
  familySettlement,
  dowerDeed,
  // Applications
  policeStationApplication,
  generalApplication,
  // Criminal Law
  bailApplication, firRegistration, quashmentPetition, murderDefense, fraudCheating,
  cyberCrime, challanResponse, appealPetition, complaintPetition, anticipatoryBail,
  // Property Law
  possessionSuit, illegalDispossession, mutationApplication, rentDispute, partitionSuit,
  specificPerformance, injunctionApplication, titleSuit, landRevenue, propertyTransferDeed,
  // Non-Muslim Laws
  christianMarriage,
  christianDivorce,
  christianCustody,
  hinduMarriage,
  hinduDivorce,
  nonMuslimSuccession,
  nonMuslimGuardianship,
  nonMuslimMaintenance,
  parsiMarriage,
  sikhMarriage,
  minorityRightsPetition,
  forcedConversionComplaint,
  worshipPlaceProtection,
  blasphemyDefense,
  religiousProperty,
  interfaithMarriage,
  discriminationComplaint,
  // Civil Law
  legalNotice,
  moneyRecovery,
  breachOfContract,
  consumerComplaint,
  defamationSuit,
  arbitrationApplication,
  stayOrder,
  // Corporate Law
  companyRegistration,
  partnershipRegistration,
  shareholderAgreement,
  boardResolution,
  windingUpPetition,
  // Tax Law
  taxAppeal,
  taxExemption,
  fbrComplaint,
  withholdingCertificate,
  // Immigration Law
  visaApplication,
  passportApplication,
  nicopApplication,
  citizenshipApplication,
  deportationDefense,
  // Constitutional Law
  writPetition,
  fundamentalRights,
  habeasCorpus,
  contemptPetition,
];

export function getTemplate(category: string, subType: string): TemplateDefinition | undefined {
  return allTemplates.find((t) => t.category === category && t.subType === subType);
}

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return allTemplates.filter((t) => t.category === category);
}

export function getAllTemplates(): TemplateDefinition[] {
  return allTemplates;
}

export const categories = [
  {
    id: "affidavit",
    name: "Affidavits",
    nameUrdu: "حلف نامے",
    icon: "FileText",
    description: "Declaration, NOC, Indemnity Bonds, Name Correction, Domicile, Heirship, Lost Documents & 35+ more",
    descriptionUrdu: "اعلان، عدم اعتراض، ضمانتی بانڈ، نام درستگی، ڈومیسائل، وارثان، گم شدہ دستاویزات اور 35+ مزید",
  },
  {
    id: "agreement",
    name: "Agreements",
    nameUrdu: "معاہدے",
    icon: "FileSignature",
    description: "Vehicle Sale, Property, Rent, Employment, Loan, Lease, NDA, MOU, Construction, Gift, Will & 40+ agreement types",
    descriptionUrdu: "بیع نامہ، کرایہ، ملازمت، قرض، لیز، رازداری، تعمیرات، گاڑی فروخت، ہبہ نامہ، وصیت اور 20+ مزید",
  },
  {
    id: "power-of-attorney",
    name: "Power of Attorney",
    nameUrdu: "مختار نامہ",
    icon: "UserCheck",
    description: "General, Special, Court Vakalatnama",
    descriptionUrdu: "عام اور خصوصی مختار نامہ",
  },
  {
    id: "family-law",
    name: "Family Law",
    nameUrdu: "خاندانی قانون",
    icon: "Heart",
    description: "Divorce, Marriage, Adoption, Khula, Maintenance, Custody, Guardianship, Inheritance & More",
    descriptionUrdu: "طلاق، نکاح، گود نامہ، خلع، نفقہ، حضانت، سرپرستی، وراثت اور مزید",
  },
  {
    id: "criminal-law",
    name: "Criminal Law",
    nameUrdu: "فوجداری قانون",
    icon: "Shield",
    description: "Bail, FIR, Quashment, Murder Defense, Fraud, Cyber Crime, Appeal & 10 templates",
    descriptionUrdu: "ضمانت، ایف آئی آر، منسوخی، قتل دفاع، دھوکہ، سائبر کرائم، اپیل",
  },
  {
    id: "property-law",
    name: "Property Law",
    nameUrdu: "جائیداد قانون",
    icon: "Landmark",
    description: "Possession, Transfer, Mutation, Rent, Partition, Injunction, Title Suit & 10 templates",
    descriptionUrdu: "قبضہ، انتقال، میوٹیشن، کرایہ، تقسیم، حکم امتناعی، ملکیت دعویٰ",
  },
  {
    id: "application",
    name: "Applications",
    nameUrdu: "درخواستیں",
    icon: "FileEdit",
    description: "Police Station and General Applications",
    descriptionUrdu: "تھانے اور عام درخواستیں",
  },
  {
    id: "non-muslim-laws",
    name: "Non-Muslim Laws",
    nameUrdu: "غیر مسلم قوانین",
    icon: "Church",
    description: "Christian, Hindu, Sikh, Parsi Laws — Marriage, Divorce, Succession, Blasphemy Defense, Forced Conversion, Minority Rights & 17 templates",
    descriptionUrdu: "مسیحی، ہندو، سکھ، پارسی قوانین — شادی، طلاق، وراثت، توہین مذہب دفاع، جبری تبدیلی مذہب، اقلیتی حقوق",
  },
  {
    id: "civil-law",
    name: "Civil Law",
    nameUrdu: "دیوانی قانون",
    icon: "Scale",
    description: "Legal Notice, Money Recovery, Breach of Contract, Consumer Complaint, Defamation, Arbitration, Stay Order",
    descriptionUrdu: "قانونی نوٹس، رقم کی وصولی، معاہدے کی خلاف ورزی، صارف شکایت، ہتک عزت، ثالثی، حکم امتناعی",
  },
  {
    id: "corporate-law",
    name: "Corporate Law",
    nameUrdu: "کارپوریٹ قانون",
    icon: "Building2",
    description: "Company Registration, Partnership, Shareholder Agreement, Board Resolution, Winding Up Petition",
    descriptionUrdu: "کمپنی رجسٹریشن، شراکت داری، شیئر ہولڈر معاہدہ، بورڈ قرارداد، کمپنی ختم کرنے کی درخواست",
  },
  {
    id: "tax-law",
    name: "Tax Law",
    nameUrdu: "ٹیکس قانون",
    icon: "Landmark",
    description: "Income Tax Appeal, Tax Exemption, FBR Complaint/Rectification, Withholding Tax Certificate",
    descriptionUrdu: "انکم ٹیکس اپیل، ٹیکس استثنیٰ، ایف بی آر شکایت/درستگی، ود ہولڈنگ ٹیکس سرٹیفکیٹ",
  },
  {
    id: "immigration-law",
    name: "Immigration Law",
    nameUrdu: "امیگریشن قانون",
    icon: "Plane",
    description: "Visa Application, Passport, NICOP/POC, Citizenship, Deportation Defense",
    descriptionUrdu: "ویزا درخواست، پاسپورٹ، نکاپ/پی او سی، شہریت، ملک بدری کے خلاف دفاع",
  },
  {
    id: "constitutional-law",
    name: "Constitutional Law",
    nameUrdu: "آئینی قانون",
    icon: "Gavel",
    description: "Writ Petition, Fundamental Rights (Article 184), Habeas Corpus, Contempt of Court",
    descriptionUrdu: "رٹ پٹیشن، بنیادی حقوق (آرٹیکل 184)، ہیبیس کارپس، توہین عدالت",
  },
];
