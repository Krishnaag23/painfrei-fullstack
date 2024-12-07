import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      // Using the first SVG from your template
      <svg width="40" height="41" viewBox="0 0 40 41" className="fill-current">
        <path
          opacity="1"
          d="M37.7778 40.2223H24C22.8954 40.2223 22 39.3268 22 38.2223V20.0001C22 18.8955 22.8954 18.0001 24 18.0001H37.7778C38.8823 18.0001 39.7778 18.8955 39.7778 20.0001V38.2223C39.7778 39.3268 38.8823 40.2223 37.7778 40.2223Z"
          fill="#D0476E"
        />
        <path d="M23.2222 0C22.6699 0 22.2222 0.447715 22.2222 1V12.3333C22.2222 12.8856 22.6699 13.3333 23.2222 13.3333H39C39.5523 13.3333 40 12.8856 40 12.3333V0.999999C40 0.447714 39.5523 0 39 0H23.2222ZM0 39C0 39.5523 0.447715 40 1 40H16.7778C17.3301 40 17.7778 39.5523 17.7778 39V27.6667C17.7778 27.1144 17.3301 26.6667 16.7778 26.6667H1C0.447716 26.6667 0 27.1144 0 27.6667V39ZM0 21.2222C0 21.7745 0.447715 22.2222 1 22.2222H16.7778C17.3301 22.2222 17.7778 21.7745 17.7778 21.2222V0.999999C17.7778 0.447714 17.3301 0 16.7778 0H1C0.447716 0 0 0.447715 0 1V21.2222Z" fill="#D0476E" />
      </svg>
    ),
    title: "Comprehensive Pain Relief",
    paragraph:
      "Our device offers targeted pain relief by leveraging the power of low TENS technology combined with Ayurvedic healing methods. Designed to relieve discomfort quickly and effectively, it helps restore balance to your body's natural processes.",
  },
  {
    id: 2,
    icon: (
      // Using the second SVG from your template
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          id="Ayurveda"
        >
          <g fill="#D0476E" className="color000000 svgShape">
            <path
              d="M1.76 14.58a14.5 14.5 0 1 0 29 0v-.5h-29zM30.44 6.64a2.55 2.55 0 0 0 .32-1.22 2.52 2.52 0 0 0-1.27-2.19 2.47 2.47 0 0 0-3.36.88l-7.12 9h7.25z"
              fill="#D0476E"
              className="color000000 svgShape"
            ></path>
          </g>
        </svg>
      </svg>
    ),
    title: "Blend of Technology and Ayurveda",
    paragraph:
      "Combining modern technology with the ancient wisdom of Ayurveda, our device offers a holistic approach to pain relief. The fusion of these two powerful systems brings you a solution that is both effective and natural.",
  },
  {
    id: 3,
    icon: (
      // Continue with next SVG
      <svg width="40" height="40" viewBox="0 0 64 64" className="fill-current">
        <g fill="#D0476E">
    <path d="M47 50H21v2H47v5a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V49H15v8a5.006 5.006 0 0 0 5 5H44a5.006 5.006 0 0 0 5-5V49H47zM17 12H43V10H17V7a3 3 0 0 1 3-3H44a3 3 0 0 1 3 3V19h2V7a5.006 5.006 0 0 0-5-5H20a5.006 5.006 0 0 0-5 5V19h2z"></path>
    <rect width="2" height="2" x="31" y="55"></rect>
    <rect width="2" height="2" x="24" y="6"></rect>
    <rect width="2" height="2" x="28" y="6"></rect>
    <path d="M19 15v4h2V16h3V14H20A1 1 0 0 0 19 15zM53 21H21a1 1 0 0 0-1 1v2H11a1 1 0 0 0-1 1V48.94a1 1 0 0 0 1.7.71L17.411 44H43a1 1 0 0 0 1-1V41h2.589L52.3 46.65a1 1 0 0 0 1.7-.71V22A1 1 0 0 0 53 21zM42 42H17a1 1 0 0 0-.7.29L12 46.543V26h8V40a1 1 0 0 0 1 1H42zm10 1.543L47.7 39.29A1 1 0 0 0 47 39H22V23H52z"></path>
    <rect width="2" height="2" x="24" y="26"></rect>
    <rect width="22" height="2" x="28" y="26"></rect>
    <rect width="26" height="2" x="24" y="30"></rect>
    <rect width="26" height="2" x="24" y="34"></rect>
    <rect width="2" height="2" x="14" y="29"></rect>
    <rect width="5" height="2" x="14" y="33"></rect>
    <rect width="5" height="2" x="14" y="37"></rect>
  </g>
      </svg>
    ),
    title: "Smart App Integration",
    paragraph:
      "With seamless smart app integration, control and monitor your pain relief experience from the convenience of your phone. Track progress, customize settings, and get the most out of your device with personalized control features.",
  },
  {
    id: 4,
    icon: (
      // Continue with next SVG
      <svg width="40" height="42" viewBox="0 0 100 100" className="fill-current">
        <path d="M31 79.5h-4v-6.1c.7 0 1.3.1 2 .1s1.3 0 2-.1v6.1zm42-6.1c-.7 0-1.3.1-2 .1s-1.3 0-2-.1v6.1h4v-6.1zm14 10.1H13c-1.7 0-3 1.3-3 3 0 1.6 1.3 3 3 3h74c1.7 0 3-1.4 3-3 0-1.7-1.3-3-3-3zM47.9 52.6c-8.8 1-15.8 8-16.8 16.8 8.8-1 15.8-8 16.8-16.8zm-21 16.8c-1-8.8-8-15.8-16.8-16.8 1 8.8 8 15.8 16.8 16.8zm63-16.8c-8.8 1-15.8 8-16.8 16.8 8.8-1 15.8-8 16.8-16.8zm-37.8 0c1 8.8 8 15.8 16.8 16.8-1-8.8-8-15.8-16.8-16.8zM39 27.5h6c1.1 0 2 .9 2 2v6c0 1.6 1.3 3 3 3s3-1.4 3-3v-6c0-1.1.9-2 2-2h6c1.7 0 3-1.4 3-3 0-1.7-1.3-3-3-3h-6c-1.1 0-2-.9-2-2v-6c0-1.7-1.3-3-3-3s-3 1.3-3 3v6c0 1.1-.9 2-2 2h-6c-1.7 0-3 1.3-3 3 0 1.6 1.3 3 3 3z" fill="#D0476E"></path>
      </svg>
    ),
    title: "Natural Healing",
    paragraph:
      "Harness the healing power of Ayurveda, with ingredients that have been used for centuries to relieve pain, reduce inflammation, and support the body's natural ability to heal.",
  },
  {
    id: 5,
    icon: (
      // Continue with next SVG
      <svg width="40" height="40" viewBox="0 0 128 128" className="fill-current">
      <path fill="#D0476E" d="M56.9,71C56.9,71,56.9,71.1,56.9,71C56.9,71.1,56.9,71.1,56.9,71c0.6,0.6,1.6,1.1,2.8,0.9
		c0.2,0,45.2-12.7,48.9-13.7c0.2-0.1,0.4-0.1,0.5-0.2c1.2-0.7,1.6-1.9,1.6-2.8c0-0.8-0.4-1.9-1.4-2.5C109.1,52.5,86,41.9,86,41.9
		l0,0l0,0c0,0-10.6-23.1-10.7-23.3c-0.6-0.9-1.6-1.3-2.5-1.4c-1,0-2.1,0.4-2.8,1.6c-0.1,0.2-0.2,0.3-0.2,0.5
		c-1,3.7-13.7,48.7-13.7,48.9C55.8,69.4,56.3,70.4,56.9,71z"></path>
  <path fill="#D0476E" d="M96 36.4l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c1.2-1.2 1.2-3.2 0-4.4-1.2-1.2-3.2-1.2-4.4 0l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2L93 30.6c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2L91.6 32c-1.2 1.2-1.2 3.2 0 4.4C92.8 37.6 94.8 37.6 96 36.4zM107.2 16.4l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2l-.3.3c-1.2 1.2-1.2 3.2 0 4.4 1.2 1.2 3.2 1.2 4.4 0l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c1.2-1.2 1.2-3.2 0-4.4C110.4 15.2 108.4 15.2 107.2 16.4zM124.1 3.9c-1.2-1.2-3.2-1.2-4.4 0l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2L118 5.6c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2l-.3.3c-.1.1-.1.1-.2.2-.1.1-.1.1-.2.2L116.6 7c-1.2 1.2-1.2 3.2 0 4.4 1.2 1.2 3.2 1.2 4.4 0l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3c.1-.1.1-.1.2-.2.1-.1.1-.1.2-.2l.3-.3C125.3 7.1 125.3 5.1 124.1 3.9z"></path>
  <path fill="#D0476E" d="M110.3,64.4l-1.2,0.3c-4.5,1.3-8.6,2.4-12.3,3.5c0,0.8,0.1,1.6,0.1,2.5c0,21.8-17.7,39.6-39.6,39.6
		c-21.8,0-39.6-17.7-39.6-39.6s17.7-39.6,39.6-39.6c0.8,0,1.6,0,2.4,0.1c1.1-4.1,2.4-8.6,3.8-13.6c0.1-0.3,0.2-0.6,0.3-0.8
		c-2.1-0.3-4.3-0.4-6.5-0.4C27.4,16.4,3,40.8,3,70.7S27.4,125,57.3,125c30,0,54.3-24.4,54.3-54.3c0-2.2-0.1-4.4-0.4-6.6
		C111,64.3,110.7,64.4,110.3,64.4z"></path>
  <path fill="#D0476E" d="M51.1,61.8c0.9-3.1,2.3-8.3,4.7-16.7c-13.4,0.8-24.1,12-24.1,25.6c0,14.1,11.5,25.7,25.7,25.7
		c13.7,0,24.9-10.7,25.6-24.2c-8.3,2.3-13.5,3.8-16.6,4.7c-2,2.9-5.3,4.8-9,4.8c-6,0-10.9-4.9-10.9-10.9
		C46.4,67,48.3,63.8,51.1,61.8z"></path>
      </svg>
    ),
    title: "Targeted Pain Relief",
    paragraph:
      "Precisely target the areas of discomfort for fast and effective relief. Whether it's muscle pain, joint pain, or nerve-related pain, our device works to relieve pain at the source.",
  },
  {
    id: 6,
    icon: (
      // Continue with last SVG
      <svg width="40" height="45" viewBox="0 0 24 24" className="fill-current">
          <path fill="#F8B1B2" d="M21 22.025H8.542c-1.364-.162-.93-1.367-.93-1.367.593-1.501 1.462-2.767 2.472-3.63a5.964 5.964 0 0 1-1.351-3.781 6.044 6.044 0 0 1 6.038-6.036c1.209 0 2.377.357 3.377 1.032.458.31.578.932.27 1.389-.31.457-.932.577-1.389.27a4.042 4.042 0 0 0-6.296 3.346c0 1.218.559 2.363 1.533 3.142a1.003 1.003 0 0 1-.166 1.67c-.706.364-1.389 1.063-1.947 1.967h9.234c-.558-.902-1.242-1.602-1.949-1.968a1 1 0 0 1-.165-1.668 4.017 4.017 0 0 0 1.533-3.143c0-.339-.058-.695-.183-1.122a1 1 0 0 1 1.92-.56c.18.614.263 1.148.263 1.683a5.954 5.954 0 0 1-1.352 3.781c1.012.865 1.883 2.13 2.475 3.63.001-.002.384 1.203-.929 1.365z"></path>
  <path fill="#D0476E" d="M8.965 14.814H4.611c.559-.903 1.241-1.603 1.947-1.967a.999.999 0 0 0 .165-1.67 4.014 4.014 0 0 1-1.532-3.142A4.042 4.042 0 0 1 9.229 4c2.017 0 3.678 1.491 3.975 3.425a6.012 6.012 0 0 1 1.568-.214c.146 0 .29.021.435.032C14.816 4.289 12.287 2 9.229 2a6.043 6.043 0 0 0-6.038 6.035c0 1.393.481 2.718 1.351 3.782-1.01.863-1.879 2.129-2.472 3.63 0 0-.383 1.244.93 1.367h6.938a5.94 5.94 0 0 1-.973-2z"></path>
      </svg>
    ),
    title: "User-Friendly Interface",
    paragraph:
      "Designed to be intuitive and easy to use, our device ensures a smooth experience from setup to operation. The simple interface allows users of all ages to operate it with ease.",
  },
];

export default featuresData;


