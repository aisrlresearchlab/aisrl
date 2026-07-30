import { cache } from "react";

export interface Member {
  id: string;
  nameEn: string;
  nameKo: string;
  category: "professor" | "phd" | "ms" | "bachelor" | "alumni";
  course: string;
  email: string;
  emailDomain: string;
  homepage: string;
  image: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  date: string;
  link: string;
  category: "Intl. Journals" | "Intl. Conferences" | "Patents";
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  type: "Notice" | "Press Release" | "Lab News";
  content: string;
}

// Initial datasets
const INITIAL_MEMBERS: Member[] = [
  {
    id: "prof-salaki",
    nameEn: "Reynaldo Joshua Salaki",
    nameKo: "레이날도 살라키",
    category: "professor",
    course: "Lecturer & AISRL Director",
    email: "reynaldo.salaki",
    emailDomain: "unsrat.ac.id",
    homepage: "mailto:reynaldo.salaki@unsrat.ac.id",
    image: "/lecturer_profile.png",
  },
  {
    id: "phd-john-doe",
    nameEn: "John Doe",
    nameKo: "존 도",
    category: "phd",
    course: "PhD Candidate (Entry: '22) - Researching Data-Intensive Software Systems",
    email: "johndoe",
    emailDomain: "lab.edu",
    homepage: "https://linkedin.com/",
    image: "",
  },
  {
    id: "phd-emily",
    nameEn: "Emily Watson",
    nameKo: "에밀리 왓슨",
    category: "phd",
    course: "PhD Candidate (Entry: '23) - Researching Digital Health Systems",
    email: "emily.w",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "phd-michael",
    nameEn: "Michael Chang",
    nameKo: "마이클 창",
    category: "phd",
    course: "PhD Candidate (Entry: '24) - Researching Smart Grid Anomalies",
    email: "mchang",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "phd-sarah",
    nameEn: "Sarah Jenkins",
    nameKo: "사라 젠킨스",
    category: "phd",
    course: "PhD Candidate (Entry: '24) - Researching Activity Recognition",
    email: "sjenkins",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "ms-david",
    nameEn: "David Miller",
    nameKo: "데이비드 밀러",
    category: "ms",
    course: "MS Candidate (Entry: '24) - Mobile Computing Systems",
    email: "dmiller",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "ms-sophia",
    nameEn: "Sophia Li",
    nameKo: "소피아 리",
    category: "ms",
    course: "MS Candidate (Entry: '25) - Wireless Sensor Networks",
    email: "sli",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "ms-lucas",
    nameEn: "Lucas Martinez",
    nameKo: "루카스 마르티네즈",
    category: "ms",
    course: "MS Candidate (Entry: '25) - Solar Grid Computing",
    email: "lmartinez",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "bach-ethan",
    nameEn: "Ethan Hunt",
    nameKo: "에단 헌트",
    category: "bachelor",
    course: "Bachelor Student (Undergraduate Researcher, Senior)",
    email: "ehunt",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "bach-olivia",
    nameEn: "Olivia Vance",
    nameKo: "올리비아 밴스",
    category: "bachelor",
    course: "Bachelor Student (Undergraduate Researcher, Junior)",
    email: "ovance",
    emailDomain: "lab.edu",
    homepage: "",
    image: "",
  },
  {
    id: "alumni-alexander",
    nameEn: "Alexander Clark",
    nameKo: "알렉산더 클라크",
    category: "alumni",
    course: "PhD Graduate ('23) - Now Machine Learning Engineer",
    email: "aclark",
    emailDomain: "techcorp.com",
    homepage: "",
    image: "",
  },
  {
    id: "alumni-chloe",
    nameEn: "Chloe Taylor",
    nameKo: "클로이 테일러",
    category: "alumni",
    course: "MS Graduate ('24) - Now Software Engineer",
    email: "ctaylor",
    emailDomain: "softsolutions.com",
    homepage: "",
    image: "",
  }
];

const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: "pub-1",
    title: "Adaptive Edge Middleware for Distributed Machine Learning Protocols",
    authors: "John Doe, Reynaldo Joshua Salaki",
    venue: "Journal of Network Computing, vol. 20, no. 4, pp. 240-255, 2026.",
    date: "2026-06",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-2",
    title: "Real-Time Sensor Drift Calibration using Recurrent Neural Networks in Smart Spaces",
    authors: "Emily Watson, Michael Chang, Reynaldo Joshua Salaki",
    venue: "IEEE Transactions on Instrumentation and Measurement, vol. 35, no. 2, pp. 1100-1115, 2026.",
    date: "2026-05",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-3",
    title: "A Deep Learning Framework for Anomaly Detection in Solar Smart Grids",
    authors: "Michael Chang, Lucas Martinez, Reynaldo Joshua Salaki",
    venue: "IEEE Access, vol. 14, pp. 1200-1215, Apr. 2026.",
    date: "2026-04",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-4",
    title: "Distributed Optimization for Federated Learning over Heterogeneous IoT Networks",
    authors: "Sarah Jenkins, David Miller, Reynaldo Joshua Salaki",
    venue: "Proceedings of IEEE INFOCOM 2025, pp. 880-889.",
    date: "2025-05",
    link: "",
    category: "Intl. Conferences",
  },
  {
    id: "pub-5",
    title: "Mobile Patient Health Tracker using IoT Edge Processing",
    authors: "Sophia Li, Reynaldo Joshua Salaki",
    venue: "Proceedings of ACM MobiCom 2025, pp. 312-321.",
    date: "2025-10",
    link: "",
    category: "Intl. Conferences",
  },
  {
    id: "pub-6",
    title: "System and method for machine-learning-based solar panel fault classification",
    authors: "Reynaldo Joshua Salaki, Michael Chang",
    venue: "International Patent Registration, No. WO-2025-012345, 2025.",
    date: "2025-09",
    link: "",
    category: "Patents",
  },
  {
    id: "pub-7",
    title: "An Optimized Scheduling Algorithm for Multitenant Data Warehouses",
    authors: "John Doe, Reynaldo Joshua Salaki",
    venue: "Software Practice and Experience, vol. 55, pp. 104-118, 2025.",
    date: "2025-08",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-8",
    title: "Performance Benchmarking of NoSQL Databases in Edge Computing Nodes",
    authors: "David Miller, Sophia Li, Reynaldo Joshua Salaki",
    venue: "Proceedings of IEEE Cloud 2025, pp. 140-149.",
    date: "2025-07",
    link: "",
    category: "Intl. Conferences",
  },
  {
    id: "pub-9",
    title: "Method and apparatus for real-time mobile diabetes glucose tracker modeling",
    authors: "Reynaldo Joshua Salaki, Emily Watson",
    venue: "Indonesian Patent Registration, No. ID-2025-998877, 2025.",
    date: "2025-06",
    link: "",
    category: "Patents",
  },
  {
    id: "pub-10",
    title: "State Management Architectures for High-Throughput Stream Processing",
    authors: "Michael Chang, Reynaldo Joshua Salaki",
    venue: "IEEE Transactions on Software Engineering, vol. 51, no. 12, pp. 2901-2915, 2024.",
    date: "2024-12",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-11",
    title: "Efficient Query Compilation in Hybrid Transactional/Analytical Databases",
    authors: "John Doe, Alexander Clark, Reynaldo Joshua Salaki",
    venue: "Proceedings of VLDB 2024, pp. 450-462.",
    date: "2024-09",
    link: "",
    category: "Intl. Conferences",
  },
  {
    id: "pub-12",
    title: "Agile Analytics: A Self-Calibrating Framework for Business Intelligence Dashboards",
    authors: "Chloe Taylor, Reynaldo Joshua Salaki",
    venue: "Information Systems Frontiers, vol. 26, pp. 889-904, 2024.",
    date: "2024-03",
    link: "https://example.com/",
    category: "Intl. Journals",
  }
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "John Doe receives Best Presentation Award at BK Workshop",
    date: "2026-06-25",
    type: "Notice",
    content: "Our PhD candidate, John Doe, has been awarded the Best Presentation Award for his research on edge middleware optimization for distributed computing. The research evaluates novel communication frameworks for federated systems.",
  },
  {
    id: "news-2",
    title: "Lab's solar grid fault detection project featured in Renewable Energy Spotlight",
    date: "2026-05-15",
    type: "Press Release",
    content: "Our recent paper on machine-learning-based solar panel fault classification was selected as a featured article in Renewable Energy Spotlight reviews.",
  },
  {
    id: "news-3",
    title: "We welcome new undergraduate researchers Olivia Vance and Ethan Hunt",
    date: "2025-09-01",
    type: "Lab News",
    content: "Olivia Vance and Ethan Hunt have joined the lab as undergraduate researchers starting Fall 2025. Olivia and Ethan will be working on IoT sensing and data analytics applications.",
  },
  {
    id: "news-4",
    title: "Edge Patient Health Tracker code repository released on GitHub",
    date: "2025-12-20",
    type: "Notice",
    content: "The official PyTorch implementation and dataset for our IoT patient monitoring systems have been open-sourced on GitHub. The framework uses edge networks to diagnose sensor anomalies.",
  },
  {
    id: "news-5",
    title: "Prof. Reynaldo Joshua Salaki invited as speaker at Smart Computing Summit",
    date: "2025-11-10",
    type: "Notice",
    content: "Prof. Reynaldo Joshua Salaki will deliver a keynote speech on the future of energy informatics and data-driven grid management at the Smart Computing Summit next month.",
  },
  {
    id: "news-6",
    title: "Emily Watson completes research internship at Biotech Software Inc.",
    date: "2025-08-15",
    type: "Lab News",
    content: "Our PhD candidate Emily Watson completed a 3-month research internship developing mobile patient tracker architectures for diabetes data systems.",
  },
  {
    id: "news-7",
    title: "AISRL lab launches open-source Data Warehousing toolkit",
    date: "2025-07-22",
    type: "Notice",
    content: "We have released an agile schema builder toolkit designed for self-calibrating enterprise database setups. The code is available on the lab's GitHub page.",
  },
  {
    id: "news-8",
    title: "David Miller receives Outstanding Academic Achievement Scholarship",
    date: "2025-06-30",
    type: "Lab News",
    content: "David Miller has been awarded the academic distinction scholarship for his software contribution in NoSQL benchmarking frameworks.",
  },
  {
    id: "news-9",
    title: "Joint paper on Agile Analytics accepted in Information Systems Frontiers",
    date: "2024-11-05",
    type: "Notice",
    content: "Our work on self-calibrating business intelligence frameworks has been accepted for publication in the upcoming issue of Information Systems Frontiers journal.",
  },
  {
    id: "news-10",
    title: "Sophia Li presents IoT glucose modeling paper at healthcare conference",
    date: "2024-10-18",
    type: "Notice",
    content: "Sophia Li presented her research paper on wearable glucose tracker modeling at the International Smart Medicine Conference.",
  },
  {
    id: "news-11",
    title: "Distinguished Alumnus Dr. Alexander Clark visits AISRL Group",
    date: "2024-05-12",
    type: "Lab News",
    content: "Dr. Alexander Clark visited the laboratory to deliver a research seminar on scalable indexing in hybrid database engines.",
  }
];

// Caching functions
export const getMembers = cache(async (): Promise<Member[]> => {
  return INITIAL_MEMBERS;
});

export const getPublications = cache(async (): Promise<Publication[]> => {
  return INITIAL_PUBLICATIONS;
});

export const getNews = cache(async (): Promise<NewsItem[]> => {
  return INITIAL_NEWS;
});
