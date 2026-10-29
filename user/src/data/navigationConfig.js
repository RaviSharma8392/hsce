/**
 * Standardized Navigation Configurations for Left Sidebar Menus
 * Implements the Holy Family institutional sidebar structure with
 * Royal Navy Blue headers (#2E3A8C) and Image 1 Blue & Yellow action boxes.
 */

export const getAboutSidebarConfig = (isHindi) => ({
  title: isHindi ? "कॉलेज परिचय" : "About HSCE",
  items: [
    {
      id: "overview",
      to: "/about",
      label: isHindi ? "कॉलेज अवलोकन" : "College Overview",
    },
    {
      id: "history",
      to: "/about/history",
      label: isHindi ? "इतिहास एवं विकास" : "History & Genesis",
    },
    {
      id: "vision-mission",
      to: "/about/vision-mission",
      label: isHindi ? "लक्ष्य एवं दृष्टि" : "Vision & Mission",
    },
    {
      id: "chairman",
      to: "/about/chairman",
      label: isHindi ? "चेयरमैन का संदेश" : "Chairman's Desk",
    },
    {
      id: "principal",
      to: "/about/principal",
      label: isHindi ? "प्राचार्या का संदेश" : "Principal's Desk",
    },
    {
      id: "recognition",
      to: "/about/recognition",
      label: isHindi ? "मान्यता एवं संबद्धता" : "Recognition & Affiliation",
    },
    {
      id: "facts",
      to: "/about/facts",
      label: isHindi ? "तथ्य विवरण" : "Fact Sheet",
    },
    {
      id: "faculty",
      to: "/faculty",
      label: isHindi ? "संकाय एवं कर्मचारी" : "Faculty & Staff",
    },
  ],
  quickActions: [
    {
      label: isHindi ? "बी.एड. कार्यक्रम" : "B.Ed. Programme",
      to: "/course",
      variant: "blue",
    },
    {
      label: isHindi ? "पाठ्यक्रम एवं सिलेबस" : "Curriculum & Syllabus",
      to: "/syllabus",
      variant: "blue",
    },
    {
      label: isHindi ? "प्रवेश पूछताछ" : "Admission Enquiry",
      to: "/enquiry",
      variant: "yellow",
    },
    {
      label: isHindi ? "परिसर भ्रमण बुक करें" : "Book Campus Visit",
      to: "/book-a-tour",
      variant: "yellow",
    },
  ],
});

export const getAdmissionsSidebarConfig = (isHindi) => ({
  title: isHindi ? "प्रवेश अनुभाग" : "Admissions",
  items: [
    {
      id: "overview",
      to: "/admissions",
      label: isHindi ? "प्रवेश अवलोकन" : "Admission Overview",
    },
    {
      id: "eligibility",
      to: "/admissions/eligibility",
      label: isHindi ? "पात्रता मापदंड" : "Eligibility Criteria",
    },
    {
      id: "procedure",
      to: "/admissions/procedure",
      label: isHindi ? "प्रवेश प्रक्रिया" : "Admission Procedure",
    },
    {
      id: "documents",
      to: "/admissions/documents",
      label: isHindi ? "आवश्यक दस्तावेज" : "Required Documents",
    },
    {
      id: "enquiry",
      to: "/enquiry",
      label: isHindi ? "प्रवेश पूछताछ फॉर्म" : "Admission Enquiry Form",
    },
    {
      id: "tour",
      to: "/book-a-tour",
      label: isHindi ? "परिसर भ्रमण बुक करें" : "Book a Campus Tour",
    },
  ],
  quickActions: [
    {
      label: isHindi ? "ऑनलाइन पूछताछ करें" : "Online Enquiry",
      to: "/enquiry",
      variant: "yellow",
    },
    {
      label: isHindi ? "परिसर भ्रमण बुक करें" : "Schedule Campus Tour",
      to: "/book-a-tour",
      variant: "yellow",
    },
    {
      label: isHindi ? "बी.एड. पाठ्यक्रम विवरण" : "B.Ed. Curriculum",
      to: "/syllabus",
      variant: "blue",
    },
    {
      label: isHindi ? "संकाय सूची देखें" : "Faculty Directory",
      to: "/faculty",
      variant: "blue",
    },
  ],
});

export const getAcademicsSidebarConfig = (isHindi, activeTab = null) => ({
  title: isHindi ? "शैक्षणिक कार्यक्रम" : "Academics",
  items: [
    {
      id: "course",
      to: "/course?tab=course",
      active: activeTab ? activeTab === "course" : undefined,
      label: isHindi ? "बी.एड. कार्यक्रम विवरण" : "B.Ed. Programme (2-Year)",
    },
    {
      id: "syllabus",
      to: "/syllabus",
      label: isHindi ? "पाठ्यक्रम एवं सिलेबस" : "Curriculum & Syllabus",
    },
    {
      id: "faculty",
      to: "/faculty",
      label: isHindi ? "संकाय एवं परामर्शदाता" : "Faculty & Mentors",
    },
    {
      id: "pedagogy",
      to: "/course?tab=pedagogy",
      active: activeTab ? activeTab === "pedagogy" : undefined,
      label: isHindi ? "शिक्षण विषय (Pedagogy)" : "Pedagogy Specializations",
    },
    {
      id: "examination",
      to: "/course?tab=examination",
      active: activeTab ? activeTab === "examination" : undefined,
      label: isHindi ? "परीक्षा एवं मूल्यांकन" : "Examination Guidelines",
    },
  ],
  quickActions: [
    {
      label: isHindi ? "एनसीटीई मान्यता पत्र" : "NCTE Recognition Order",
      to: "/about/recognition",
      variant: "blue",
    },
    {
      label: isHindi ? "जीजीएसआईपीयू संबद्धता" : "GGSIPU Affiliation",
      to: "/about/recognition",
      variant: "blue",
    },
    {
      label: isHindi ? "प्रवेश पूछताछ" : "Admission Enquiry",
      to: "/enquiry",
      variant: "yellow",
    },
    {
      label: isHindi ? "परिसर का दौरा" : "Book Campus Tour",
      to: "/book-a-tour",
      variant: "yellow",
    },
  ],
});

export const getCampusLifeSidebarConfig = (isHindi, activeTab = null) => ({
  title: isHindi ? "सुविधाएं एवं परिसर" : "Facilities",
  items: [
    {
      id: "overview",
      to: "/campus-life?tab=overview",
      active: activeTab ? activeTab === "overview" : undefined,
      label: isHindi ? "परिसर का जीवन (अवलोकन)" : "Campus Life Overview",
    },
    {
      id: "classrooms",
      to: "/campus-life?tab=classrooms",
      active: activeTab ? activeTab === "classrooms" : undefined,
      label: isHindi ? "स्मार्ट क्लासरूम" : "Smart Classrooms",
    },
    {
      id: "ict-lab",
      to: "/campus-life?tab=ict-lab",
      active: activeTab ? activeTab === "ict-lab" : undefined,
      label: isHindi ? "आईसीटी व कंप्यूटर लैब" : "ICT & Computer Lab",
    },
    {
      id: "science-lab",
      to: "/campus-life?tab=science-lab",
      active: activeTab ? activeTab === "science-lab" : undefined,
      label: isHindi ? "पाठ्यक्रम संसाधन लैब" : "Curriculum Resource Lab",
    },
    {
      id: "library",
      to: "/campus-life?tab=library",
      active: activeTab ? activeTab === "library" : undefined,
      label: isHindi ? "पुस्तकालय एवं वाचनालय" : "Library & Resource Center",
    },
    {
      id: "auditorium",
      to: "/campus-life?tab=auditorium",
      active: activeTab ? activeTab === "auditorium" : undefined,
      label: isHindi ? "बहुउद्देशीय सभागार" : "Multipurpose Hall",
    },
    {
      id: "sports",
      to: "/campus-life?tab=sports",
      active: activeTab ? activeTab === "sports" : undefined,
      label: isHindi ? "खेल एवं योग केंद्र" : "Sports & Yoga Ground",
    },
    {
      id: "gallery",
      to: "/gallery",
      active: activeTab ? activeTab === "gallery" : undefined,
      label: isHindi ? "फोटो एवं कार्यक्रम गैलरी" : "Photo & Event Gallery",
    },
  ],
  quickActions: [
    {
      label: isHindi ? "परिसर भ्रमण बुक करें" : "Book Campus Visit",
      to: "/book-a-tour",
      variant: "yellow",
    },
    {
      label: isHindi ? "प्रवेश पूछताछ" : "Admission Enquiry",
      to: "/enquiry",
      variant: "yellow",
    },
    {
      label: isHindi ? "संकाय विवरण" : "Faculty Directory",
      to: "/faculty",
      variant: "blue",
    },
  ],
});

export const getGovernanceSidebarConfig = (isHindi, activeTab = null) => ({
  title: isHindi ? "वैधानिक प्रकटीकरण" : "Governance",
  items: [
    {
      id: "mandatory-disclosure",
      to: "/mandatory-disclosure",
      label: isHindi ? "अनिवार्य प्रकटीकरण (NCTE)" : "Mandatory Disclosure (NCTE)",
    },
    {
      id: "committees",
      to: "/committees?tab=directory",
      active: activeTab === "directory",
      label: isHindi ? "संस्थागत समितियां व प्रकोष्ठ" : "Committees & Cells",
    },
    {
      id: "grievance",
      to: "/committees?tab=lodge",
      active: activeTab === "lodge",
      label: isHindi ? "ऑनलाइन शिकायत निवारण" : "Lodge Online Grievance",
    },
    {
      id: "notices",
      to: "/notices",
      label: isHindi ? "आधिकारिक सूचनाएं व परिपत्र" : "Notices & Circulars",
    },
    {
      id: "recognition",
      to: "/about/recognition",
      label: isHindi ? "मान्यता व संबद्धता आदेश" : "Recognition Orders",
    },
    {
      id: "faculty",
      to: "/faculty",
      label: isHindi ? "संकाय व कर्मचारी सूची" : "Faculty & Staff Profile",
    },
  ],
  quickActions: [
    {
      label: isHindi ? "प्रकटीकरण फॉर्म" : "Mandatory Disclosure",
      to: "/mandatory-disclosure",
      variant: "blue",
    },
    {
      label: isHindi ? "ऑनलाइन शिकायत दर्ज करें" : "Lodge a Grievance",
      to: "/committees?tab=lodge",
      variant: "yellow",
    },
    {
      label: isHindi ? "कार्यालय संपर्क" : "Contact Administrative Desk",
      to: "/contact",
      variant: "yellow",
    },
  ],
});
