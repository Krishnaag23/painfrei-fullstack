import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "Painfrei Blogs",
    paragraph:
      "Coming Soon, stay tuned for the latest updates.",
    image: "/images/blog/placeholder.webp",
    author: {
      name: "John Doe",
      image: "/images/blog/placeholder.webp",
      designation: "Pain Management Specialist",
    },
    tags: ["Painrelief"],
    publishDate: "01/01/2025",
  },
  {
    id: 2,
    title: "Blog",
    paragraph:
      "Coming Soon, stay tuned for the latest updates.",
    image: "/images/blog/placeholder.webp",
    author: {
      name: "Jane Doe",
      image: "/images/blog/placeholder.webp",
      designation: "BioMedical Engineer",
    },
    tags: ["TENS"],
    publishDate: "01/01/2025",
  },
  {
    id: 3,
    title: "Painfrei Blogs",
    paragraph:
      "Coming Soon, stay tuned for the latest updates.",
    image: "/images/blog/placeholder.webp",
    author: {
      name: "Joe Doe",
      image: "/images/blog/placeholder.webp",
      designation: "Health Advisor",
    },
    tags: ["Ayurveda"],
    publishDate: "01/01/2025",
  },
];
export default blogData;
