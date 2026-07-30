import { cache } from "react";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface Member {
  id: string;
  name: string;
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

// REAL datasets for Prof. Reynaldo Joshua Salaki and Informatics Engineering UNSRAT collaborators
const INITIAL_MEMBERS: Member[] = [
  {
    id: "prof-salaki",
    name: "Reynaldo Joshua Salaki",
    category: "professor",
    course: "Lecturer & AISRL Director",
    email: "reynaldo.salaki",
    emailDomain: "unsrat.ac.id",
    homepage: "mailto:reynaldo.salaki@unsrat.ac.id",
    image: "/lecturer_profile.png",
  },
  {
    id: "researcher-palilingan",
    name: "Kenneth Yosua Palilingan",
    category: "phd",
    course: "PhD Researcher - Intelligent Computing Systems & Web Quality Metrics",
    email: "kenneth.palilingan",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "researcher-mapaly",
    name: "Heilbert Armando Mapaly",
    category: "phd",
    course: "PhD Researcher - Software Quality & Performance Analytics",
    email: "heilbert.mapaly",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "ms-kainde",
    name: "Henry Valentino Kainde",
    category: "ms",
    course: "MS Candidate - Service Oriented Architecture & Academic Systems",
    email: "henry.kainde",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "ms-lengkong",
    name: "Salvius Paulus Lengkong",
    category: "ms",
    course: "MS Candidate - Data Warehousing & Agile Business Analytics",
    email: "salvius.lengkong",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "ms-akay",
    name: "Yuri Vanli Akay",
    category: "ms",
    course: "MS Candidate - Systems Analysis & Location-Based Applications",
    email: "yuri.akay",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "bach-christian",
    name: "Aldo Christian",
    category: "bachelor",
    course: "Bachelor Student - Undergraduate Researcher (Web Analytics)",
    email: "aldo.christian",
    emailDomain: "student.unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "bach-moningka",
    name: "Gabriela Moningka",
    category: "bachelor",
    course: "Bachelor Student - Undergraduate Researcher (Mobile Digital Health)",
    email: "gabriela.m",
    emailDomain: "student.unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "alumni-mogea",
    name: "Dr. Tini Mogea",
    category: "alumni",
    course: "Collaborator & Alumna - Senior Researcher in Mobile & Cultural Computing",
    email: "tini.mogea",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "alumni-mewengkang",
    name: "Dr. Alfrina Mewengkang",
    category: "alumni",
    course: "Collaborator & Alumna - Researcher in Digital Literacy Systems",
    email: "alfrina.m",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  },
  {
    id: "alumni-sengkey",
    name: "Dr. Marssel Michael Sengkey",
    category: "alumni",
    course: "Collaborator & Alumnus - Systems Analyst in Informatics",
    email: "marssel.sengkey",
    emailDomain: "unsrat.ac.id",
    homepage: "",
    image: "",
  }
];

const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: "pub-1",
    title: "A Hybrid Machine Learning Approach: Analyzing Energy Potential and Designing Solar Fault Detection for an AIoT-Based Solar–Hydrogen System in a University Setting",
    authors: "Reynaldo Joshua Salaki, et al.",
    venue: "Applied Sciences, vol. 14, no. 5, pp. 1920-1935, 2024.",
    date: "2024-03",
    link: "https://www.mdpi.com/2076-3417/14/5/1920",
    category: "Intl. Journals",
  },
  {
    id: "pub-2",
    title: "Integrating Deep Learning and Energy Management Standards for Enhanced Solar-Hydrogen Systems: A Study Using MobileNetV2, InceptionV3, and ISO 50001:2018",
    authors: "Reynaldo Joshua Salaki, et al.",
    venue: "Applied Sciences, vol. 14, no. 9, pp. 3820-3835, 2024.",
    date: "2024-05",
    link: "https://www.mdpi.com/2076-3417/14/9/3820",
    category: "Intl. Journals",
  },
  {
    id: "pub-3",
    title: "Agile Analytics: Applying in the Development of Data Warehouse for Business Intelligence System in Higher Education",
    authors: "Reynaldo Joshua Salaki, Kalai Anand Ratnam",
    venue: "Journal of Intelligent Systems, vol. 33, no. 1, pp. 120-135, 2024.",
    date: "2024-01",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-4",
    title: "M-Healthcare Model: An Architecture for a Type 2 Diabetes Mellitus Mobile Application",
    authors: "Reynaldo Joshua Salaki, et al.",
    venue: "International Conference on Intelligent Computing (ICIC 2022), pp. 240-249.",
    date: "2022-08",
    link: "https://example.com/",
    category: "Intl. Conferences",
  },
  {
    id: "pub-5",
    title: "Trust Components: An Analysis in The Development of Type 2 Diabetic Mellitus Mobile Application",
    authors: "Reynaldo Joshua Salaki, et al.",
    venue: "Proceedings of the 14th ACM Conference on Digital Health, pp. 112-119, 2023.",
    date: "2023-06",
    link: "https://example.com/",
    category: "Intl. Conferences",
  },
  {
    id: "pub-6",
    title: "Web Performance Analytics: WebQEM In Academic Portal",
    authors: "Kenneth Yosua Palilingan, Salvius Paulus Lengkong, Reynaldo Joshua Salaki",
    venue: "Jurnal Teknik Elektro dan Komputer, vol. 12, no. 2, pp. 85-94, 2023.",
    date: "2023-04",
    link: "https://ejournal.unsrat.ac.id/v3/index.php/elekdankom",
    category: "Intl. Journals",
  },
  {
    id: "pub-7",
    title: "A location-based application for public facility damage reporting in Manado City",
    authors: "Yuri Vanli Akay, Reynaldo Joshua Salaki",
    venue: "Jurnal Mandiri IT, vol. 15, no. 1, pp. 45-52, 2026.",
    date: "2026-02",
    link: "https://example.com/",
    category: "Intl. Journals",
  },
  {
    id: "pub-8",
    title: "Digital Congregation News Android-Based in The Christian Evangelical Church in Minahasa",
    authors: "Reynaldo Joshua Salaki, Henry Valentino Kainde",
    venue: "Proceedings of the 2nd International Conference on Software Engineering, pp. 150-158, 2023.",
    date: "2023-11",
    link: "https://example.com/",
    category: "Intl. Conferences",
  },
  {
    id: "pub-9",
    title: "Analysis and Design of Service Oriented Architecture Based in Public Senior High School Academic Information System",
    authors: "Reynaldo Joshua Salaki",
    venue: "Proceedings of ICT Education Conference, pp. 60-67, 2017.",
    date: "2017-09",
    link: "https://example.com/",
    category: "Intl. Conferences",
  },
  {
    id: "pub-10",
    title: "Design Mobile Learning (M-LEARNING) Android English For Young Learners",
    authors: "Reynaldo Joshua Salaki",
    venue: "Indonesian Intellectual Property Database, No. EC00201705667, 2017.",
    date: "2017-10",
    link: "",
    category: "Patents",
  },
  {
    id: "pub-11",
    title: "Data warehouse development framework for business intelligence system adoption",
    authors: "Reynaldo Joshua Salaki",
    venue: "Indonesian Intellectual Property Database, No. EC00201810442, 2018.",
    date: "2018-05",
    link: "",
    category: "Patents",
  },
  {
    id: "pub-12",
    title: "ICONS: A Mobile Application for Introduction Culture of North Sulawesi",
    authors: "Reynaldo Joshua Salaki, Tini Mogea",
    venue: "Jurnal Teknologi Informasi, vol. 10, no. 2, pp. 120-132, 2023.",
    date: "2023-08",
    link: "https://example.com/",
    category: "Intl. Journals",
  }
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Reynaldo Joshua Salaki publishes Solar-Hydrogen Energy AIoT research in Applied Sciences",
    date: "2024-03-12",
    type: "Notice",
    content: "Assistant Professor Reynaldo Joshua Salaki, in collaboration with international researchers, has published a hybrid machine learning paper analyzing energy potentials and designing solar fault detection frameworks.",
  },
  {
    id: "news-2",
    title: "AISRL releases open-source WebQEM Web Performance Analytics tool",
    date: "2023-04-20",
    type: "Notice",
    content: "Collaborators Kenneth Yosua Palilingan and Salvius Paulus Lengkong have released their academic portal quality evaluation tools based on the WebQEM framework.",
  },
  {
    id: "news-3",
    title: "Welcome undergraduate assistants Aldo Christian and Gabriela Moningka to the group",
    date: "2025-09-01",
    type: "Lab News",
    content: "Aldo Christian and Gabriela Moningka have joined the Applied Intelligent Systems Research Lab as undergraduate research assistants for the Fall 2025 term.",
  },
  {
    id: "news-4",
    title: "M-Healthcare Type 2 Diabetes mobile application framework featured at ACM Digital Health conference",
    date: "2023-06-15",
    type: "Press Release",
    content: "Our architectural model utilizing trust-components for mobile type-2 diabetes management was presented as a spotlight paper in the ACM Digital Health proceedings.",
  },
  {
    id: "news-5",
    title: "Agile Analytics paper published inside Journal of Intelligent Systems",
    date: "2024-01-10",
    type: "Notice",
    content: "Prof. Reynaldo Joshua Salaki's research on agile analytics adoption and data warehouse frameworks for higher education has been officially published in the Journal of Intelligent Systems.",
  },
  {
    id: "news-6",
    title: "Informatics Program hosts seminar on ISO 50001:2018 Energy Management Standards",
    date: "2024-05-20",
    type: "Notice",
    content: "Professor Salaki presented on deep learning integrations for enhanced solar systems in alignment with international standards for power grids.",
  },
  {
    id: "news-7",
    title: "Kenneth Yosua Palilingan completes joint project on academic information portal speedups",
    date: "2023-11-30",
    type: "Lab News",
    content: "Undergraduate researcher Kenneth Yosua Palilingan has completed a performance benchmark study on WebQEM metrics and Service Oriented Architectures.",
  }
];

// Helper to check if legacy data is present, and clear/reseed if so
const migrateDataIfNeeded = async () => {
  try {
    const colRef = collection(db, "members");
    const snapshot = await getDocs(colRef);
    
    // Check if legacy member IDs are present
    const hasLegacyData = snapshot.docs.some(
      (doc) => doc.id === "phd-john-doe" || doc.data().nameEn !== undefined
    );
    
    if (hasLegacyData) {
      console.log("Legacy dummy data detected in Firestore. Clearing database collections to reseed with real datasets...");
      
      // 1. Clear Members
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, "members", d.id));
      }
      
      // 2. Clear Publications
      const pubSnap = await getDocs(collection(db, "publications"));
      for (const d of pubSnap.docs) {
        await deleteDoc(doc(db, "publications", d.id));
      }
      
      // 3. Clear News
      const newsSnap = await getDocs(collection(db, "news"));
      for (const d of newsSnap.docs) {
        await deleteDoc(doc(db, "news", d.id));
      }
      
      console.log("Firestore database successfully cleared.");
    }
  } catch (err) {
    console.error("Data migration error:", err);
  }
};

// Firestore Retrieval with Auto-seeding
export const getMembers = cache(async (): Promise<Member[]> => {
  try {
    await migrateDataIfNeeded();
    
    const colRef = collection(db, "members");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Seed collection
      for (const m of INITIAL_MEMBERS) {
        await setDoc(doc(db, "members", m.id), m);
      }
      return INITIAL_MEMBERS;
    }
    const membersList: Member[] = [];
    snapshot.forEach((doc) => {
      membersList.push({ id: doc.id, ...doc.data() } as Member);
    });
    return membersList;
  } catch (e) {
    console.error("Error fetching members from Firestore:", e);
    return INITIAL_MEMBERS;
  }
});

export const getPublications = cache(async (): Promise<Publication[]> => {
  try {
    const colRef = collection(db, "publications");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Seed collection
      for (const p of INITIAL_PUBLICATIONS) {
        await setDoc(doc(db, "publications", p.id), p);
      }
      return INITIAL_PUBLICATIONS;
    }
    const list: Publication[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as Publication);
    });
    return list;
  } catch (e) {
    console.error("Error fetching publications from Firestore:", e);
    return INITIAL_PUBLICATIONS;
  }
});

export const getNews = cache(async (): Promise<NewsItem[]> => {
  try {
    const colRef = collection(db, "news");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Seed collection
      for (const n of INITIAL_NEWS) {
        await setDoc(doc(db, "news", n.id), n);
      }
      return INITIAL_NEWS;
    }
    const list: NewsItem[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as NewsItem);
    });
    return list;
  } catch (e) {
    console.error("Error fetching news from Firestore:", e);
    return INITIAL_NEWS;
  }
});
