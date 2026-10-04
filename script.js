/* =======================================================
   BAM'S DAY - CARE BEARS VIBRANT RAINBOW SCRIPT
   Interactive Storyboard, Audio Synth, Photo Booth & Canvas Engine
   ======================================================= */

// Global State
const appState = {
  currentScene: 1,
  totalScenes: 7,
  isAudioPlaying: false,
  audioCtx: null,
  isEnvelopeOpened: false,
  hisPhotoData: (localStorage.getItem('bamsDay_hisPhoto') && localStorage.getItem('bamsDay_hisPhoto').startsWith('data:image')) ? localStorage.getItem('bamsDay_hisPhoto') : '24427.jpg',
  herPhotoData: null,
  herStream: null,
  hisImageObj: null,
  herImageObj: null
};

// Care Bears Memory Gallery Data (Grounded, sincere memories)
const memoryCards = [
  {
    title: "วันแรกที่ได้รู้จักกับแบมๆ",
    text: "จำได้เลยว่าวันนั้นตื่นเต้นมาก พูดอะไรแทบไม่ออก ดีใจจริงๆ ที่ได้รู้จักกับแบมๆ นะ",
    date: "Memory #1",
    img: "assets/carebears/bestfriend-wave.png",
    sticker1: "assets/carebears/bedtime-hearts.png",
    sticker2: "assets/carebears/star-swing.png"
  },
  {
    title: "ทริปที่เราไปด้วยกัน",
    text: "สนุกดีนะ ไม่ว่าจะไปที่ไหน แค่ไปด้วยกันก็โอเคหมดแล้ว ไว้วันหยุดยาวค่อยไปเที่ยวกันอีกนะ",
    date: "Memory #2",
    img: "assets/carebears/funshine-umbrella.png",
    sticker1: "assets/carebears/oopsy-skate-hd.png",
    sticker2: "assets/carebears/friend-swing.png"
  },
  {
    title: "ตอนพาแบมๆ ไปกินของอร่อย",
    text: "เห็นแบมๆ ได้กินของชอบแล้วมีความสุข เค้าก็สบายใจ เดี๋ยวไว้พาไปกินอีกบ่อยๆ นะ",
    date: "Memory #3",
    img: "assets/carebears/harmony-cloud.png",
    sticker1: "assets/carebears/funshine-run.png",
    sticker2: "assets/carebears/bestfriend-wave.png"
  },
  {
    title: "เวลาแบมๆ หน้างอน้อยใจ",
    text: "เค้าเป็นคนทื่อๆ ง้อไม่ค่อยเก่งหรอก แต่ไม่ได้ตั้งใจทำให้แบมๆ หงุดหงิดนะ มีอะไรบอกกันตรงๆ ได้ตลอดเลย",
    date: "Memory #4",
    img: "assets/carebears/grumpy-front.png",
    sticker1: "assets/carebears/grumpy-standing.png",
    sticker2: "assets/carebears/bedtime-hearts.png"
  },
  {
    title: "HBD นะแบมๆ 🎂",
    text: "ขอบคุณที่อยู่ข้างกันและเข้าใจกันมาตลอดนะ อยู่เป็นกำลังใจให้เค้าไปนานๆ นะครับ",
    date: "Memory #5",
    img: "assets/carebears/bedtime-sleep.png",
    sticker1: "assets/carebears/star-swing.png",
    sticker2: "assets/carebears/funshine-umbrella.png"
  }
];

// Care Bears Tarot Cards Data (8 Magical Archetypes)
const tarotCards = [
  {
    id: "sun",
    numeral: "I • THE SUN OF JOY",
    name: "Funshine Bear",
    title: "ไพ่พระอาทิตย์แห่งรอยยิ้ม ☀️",
    aspect: "พลังใจ & ความสดใส",
    img: "assets/carebears/funshine-umbrella.png",
    blessing: "ปีนี้ขอให้ทุกๆ วันของแบมๆ สว่างไสวเหมือนพระอาทิตย์ยามเช้า เต็มไปด้วยเสียงหัวเราะ รอยยิ้ม และเค้าจะคอยเป็นแสงแดดอบอุ่นที่อยู่ข้างๆ เสมอนะ!",
    keyword: "ความสุขล้นใจ • รอยยิ้มเปล่งประกาย"
  },
  {
    id: "moon",
    numeral: "II • THE SWEET DREAMER",
    name: "Bedtime Bear",
    title: "ไพ่นิทราอันแสนหวาน 🌙",
    aspect: "สุขภาพ & ความสบายใจ",
    img: "assets/carebears/bedtime-sleep.png",
    blessing: "ขอให้แบมๆ นอนหลับฝันดีทุกคืน ไม่ปวดหัว ไม่คิดมาก สุขภาพแข็งแรง อยู่ไกลกันเค้าเป็นห่วงสุขภาพแบมๆ ที่สุด พักผ่อนเยอะๆ นะคนเก่ง",
    keyword: "กายใจสงบสุข • สุขภาพแข็งแรง"
  },
  {
    id: "lovers",
    numeral: "III • THE ETERNAL LOVERS",
    name: "Best Friend Bear",
    title: "ไพ่คู่แท้ตลอดกาล 💖",
    aspect: "ความรัก & ความผูกพัน",
    img: "assets/carebears/bestfriend-wave.png",
    blessing: "ไพ่ใบนี้ยืนยันว่า ความรักของเค้าที่มีให้แบมๆ มั่นคงและไม่มีวันลดลงเลย แม้จะทำงานหนักหรืออยู่ไกลกัน แต่ในใจเค้ามีแต่แบมๆ ตลอดไปครับ!",
    keyword: "รักแท้มั่นคง • คู่แท้ตลอดกาล"
  },
  {
    id: "grumpy",
    numeral: "IV • THE POUTY SWEETHEART",
    name: "Grumpy Bear",
    title: "ไพ่เจ้าหมีขี้งอนแต่น่ารัก 🌧️💙",
    aspect: "คนคอยโอ๋ & ไม่เคยรำคาญ",
    img: "assets/carebears/grumpy-front.png",
    blessing: "ต่อให้ปีนี้แบมๆ จะเหนื่อย ขี้งอน หรือหน้างอน้อยใจเค้าแค่ไหน... ไพ่ใบนี้บอกว่าเค้าคนนี้พร้อมจะง้อ พร้อมจะกอด และพร้อมจะยอมแบมๆ ทุกเรื่องเสมอเลยนะ!",
    keyword: "หน้างอก็น่ารัก • พร้อมง้อตลอดไป"
  },
  {
    id: "harmony",
    numeral: "V • THE PURE HARMONY",
    name: "Harmony Bear",
    title: "ไพ่ความราบรื่นและสันติ 🌸",
    aspect: "ความราบรื่น & ความสบายใจ",
    img: "assets/carebears/harmony-cloud.png",
    blessing: "ขอให้ชีวิตของแบมๆ ในปีนี้ราบรื่น ไร้อุปสรรค มีความสบายใจนุ่มฟูเหมือนนอนอยู่บนปุยเมฆสีชมพู ทุกเรื่องที่กังวลจะคลี่คลายอย่างสวยงามนะ",
    keyword: "ชีวิตราบรื่น • สบายใจนุ่มฟู"
  },
  {
    id: "star",
    numeral: "VI • THE WISHING STAR",
    name: "Oopsy Bear",
    title: "ไพ่ดวงดาวสมปรารถนา ⭐✨",
    aspect: "โชคลาภ & ความสำเร็จ",
    img: "assets/carebears/oopsy-skate-hd.png",
    blessing: "ดวงดาวแห่งความปรารถนาจะนำพาโอกาสดีๆ และความสำเร็จมาให้แบมๆ ในทุกเรื่องที่ตั้งใจ ขอให้โชคดี มีแต่เรื่องน่ารักๆ วิ่งเข้ามาหานะ!",
    keyword: "สมความปรารถนา • โชคดีรอบด้าน"
  },
  {
    id: "swing",
    numeral: "VII • THE JOYFUL SWING",
    name: "Grumpy & Hugs",
    title: "ไพ่ชิงช้าแห่งการผจญภัย 🎡🌈",
    aspect: "ความทรงจำ & การเดินทาง",
    img: "assets/carebears/star-swing.png",
    blessing: "ปีนี้เค้าจะพยายามเคลียร์งานและหาเวลาพาแบมๆ ไปเที่ยว ไปเปิดหูเปิดตา และสร้างความทรงจำดีๆ ด้วยกันให้เยอะขึ้นนะ สัญญาเลย!",
    keyword: "ทริปแห่งความสุข • ความทรงจำใหม่"
  },
  {
    id: "friend",
    numeral: "VIII • THE SUNFLOWER LOVE",
    name: "Friend Bear",
    title: "ไพ่ทานตะวันคู่พักพิง 🌻💛",
    aspect: "มิตรภาพ & พลังเคียงข้าง",
    img: "assets/carebears/friend-swing.png",
    blessing: "ขอบคุณที่เป็นทั้งแฟนและเพื่อนที่ดีที่สุดในชีวิตเค้า ขอให้เราสองคนเป็นพลังบวกและที่พักใจของกันและกันแบบนี้ตลอดไปนะคนดี",
    keyword: "คนรู้ใจที่สุด • กำลังใจที่ไม่มีวันหมด"
  }
];

// 20 Lucky Symbols for Thunder Heart (Libra Bear - Oct 4)
const thunderSymbols = [
  {
    id: "lightning",
    icon: "⚡",
    name: "สายฟ้าพลังใจ",
    tag: "Thunder Spark",
    aspect: "พลังบวก & ไฟลุกโชน",
    forecast1: "สายฟ้าแห่งความหวังจะคอยปัดเป่าความเหงาและความกังวลใจ ความรักจะเต็มไปด้วยความอบอุ่นและมีคนรักคอยอยู่เคียงข้างเสมอ",
    forecast2: "Thunder Heart ส่งพลังสายฟ้าชาร์จไฟให้แบมๆ ในวันที่เหนื่อยล้า เธอจะมีเรี่ยวแรงและไฟในการใช้ชีวิตกลับมาอย่างสดใส",
    forecast3: "จะมีโอกาสดีๆ วิ่งเข้ามาหาแบบเร็วทันใจ อะไรที่รอคอยมานานจะเริ่มขยับและเห็นผลลัพธ์ที่ดีเยี่ยม",
    thunderBlessing: "⚡ Thunder Heart ขอส่งกระแสจิต: เมื่อไหร่ที่แบมๆ รู้สึกแบตหมด ให้จำไว้ว่าพลังใจในตัวแบมๆ สว่างไสวเสมอ!"
  },
  {
    id: "scales",
    icon: "⚖️",
    name: "ตราชั่งราศีตุลย์",
    tag: "Libra Balance",
    aspect: "สมดุลชีวิต & สบายใจ",
    forecast1: "ดวงดาวราศีตุลย์จะนำพาความเข้าใจอันลึกซึ้งมาสู่ความรัก ระยะทางจะไม่ใช่อุปสรรคเพราะหัวใจทั้งสองดวงตรงกัน",
    forecast2: "ความเครียดจะลดฮวบ สุขภาพกายและใจของแบมๆ จะกลับมาสมดุล ได้กินอิ่มนอนหลับสบายอย่างผ่อนคลาย",
    forecast3: "การตัดสินใจเรื่องสำคัญในปีนี้จะราบรื่น ชั่งน้ำหนักทางไหนก็มีแต่ผลดีและความสำเร็จตามมา",
    thunderBlessing: "♎ สารจากเทพีแห่งตราชั่ง: ปีนี้จิตใจของแบมๆ จะนิ่งสงบ ความกังวลจะสลายไป และพบความสุขที่แท้จริง!"
  },
  {
    id: "heart",
    icon: "💖",
    name: "หัวใจสีชมพู",
    tag: "True Heart",
    aspect: "ความรักที่มั่นคง",
    forecast1: "หัวใจของแบมๆ จะถูกโอบกอดด้วยความรักที่มั่นคงและจริงใจ คนรักจะดูแลและมีแบมๆ อยู่ในแผนอนาคตเสมอ",
    forecast2: "จิตใจจะได้รับการเติมเต็ม มีแต่คนรอบตัวมอบความรักและความเอ็นดูให้ ไม่ต้องรู้สึกโดดเดี่ยวเลย",
    forecast3: "มีเกณฑ์ได้รับมิตรภาพที่จริงใจ ของขวัญชวนใจฟู และความเมตตาจากผู้ใหญ่รอบข้าง",
    thunderBlessing: "💖 Thunder Heart ขอบอกว่า: หัวใจของแบมๆ มีค่าและคู่ควรกับความรักที่จริงใจที่สุดเสมอ!"
  },
  {
    id: "rainbow",
    icon: "🌈",
    name: "สายรุ้งหลังฝน",
    tag: "Hopeful Rainbow",
    aspect: "ฟ้าหลังฝนที่สดใส",
    forecast1: "ช่วงเวลาที่เคยเหงาหรือนอยด์จะค่อยๆ ผ่านพ้นไป ฟ้าหลังฝนในความสัมพันธ์จะมีแต่ความสดใสและรอยยิ้ม",
    forecast2: "ปัญหาหรือความกังวลใจใดๆ ที่ติดค้างอยู่จะคลี่คลายลงอย่างน่าอัศจรรย์ ความสุขกำลังรออยู่ข้างหน้า",
    forecast3: "โชคดีกำลังจะเรียงแถวเข้ามา เหมือนสายรุ้งที่ทอดยาว นำพาเรื่องน่าชื่นใจมาให้อย่างต่อเนื่อง",
    thunderBlessing: "🌈 สายรุ้งนำทาง: หลังจากพายุผ่านไป ฟ้าของแบมๆ จะสดใสและเต็มไปด้วยสีสันแห่งความยินดี!"
  },
  {
    id: "star",
    icon: "🌟",
    name: "ดาวประกายนำทาง",
    tag: "Guiding Star",
    aspect: "เป้าหมาย & ความสำเร็จ",
    forecast1: "ดวงดาวจะส่องแสงนำทางให้ความรักดำเนินไปด้วยความมั่นคง เป็นแสงสว่างให้แก่กันและกันในทุกก้าว",
    forecast2: "ไม่ว่าแบมๆ จะเริ่มต้นทำสิ่งใหม่หรือโปรเจกต์ใด จะมีความมั่นใจและทำออกมาได้ยอดเยี่ยม",
    forecast3: "จะมีโชคลาภเข้ามาจากทิศทางที่คาดไม่ถึง และได้รับคำชมรวมถึงการยอมรับในสิ่งที่ตั้งใจทำ",
    thunderBlessing: "🌟 ดวงดาวแห่ง Care-a-Lot: แบมๆ เปล่งประกายในแบบของตัวเองเสมอ จงเชื่อมั่นในพลังของเธอนะ!"
  },
  {
    id: "sun",
    icon: "☀️",
    name: "ดวงตะวันร่าเริง",
    tag: "Radiant Sun",
    aspect: "รอยยิ้ม & ความสดใส",
    forecast1: "รอยยิ้มของแบมๆ คือพลังอันอบอุ่นที่จะทำให้ทุกวันในความสัมพันธ์สดใสเหมือนมีแดดยามเช้า",
    forecast2: "อารมณ์ดีตลอดปี เรื่องหม่นหมองเข้ามาก็สลายไปเร็ว แบมๆ จะกลายเป็นคนส่งพลังบวกให้คนรอบข้าง",
    forecast3: "ความสดใสจะดึงดูดสิ่งดีๆ และโชคลาภเข้ามาง่ายดาย ทำอะไรก็มีคนคอยเปิดทางให้สะดวก",
    thunderBlessing: "☀️ พรอันอบอุ่น: ขอให้ปีนี้รอยยิ้มของแบมๆ สดใสและส่องสว่างกว่าดวงตะวันใดๆ!"
  },
  {
    id: "moon",
    icon: "🌙",
    name: "จันทร์เสี้ยวฝันหวาน",
    tag: "Sweet Dreams",
    aspect: "การพักผ่อน & ความสงบ",
    forecast1: "ความรักจะเป็นที่พักใจอันแสนสงบ ไม่ว่าจะเหนื่อยจากไหนมา เมื่อได้คุยกันใจจะเบาสบายเสมอ",
    forecast2: "สุขภาพการนอนจะดีขึ้น หลับลึกไม่สะดุ้งตื่น ตื่นมาพร้อมความสดชื่นและมีเรี่ยวแรงเต็มเปี่ยม",
    forecast3: "จะได้พบเจอความสงบสุขในใจ เรื่องวุ่นวายรอบตัวจะไม่สามารถมารบกวนความสุขของแบมๆ ได้",
    thunderBlessing: "🌙 ค่ำคืนแห่งการเยียวยา: พักผ่อนให้เต็มที่นะคนเก่ง ดวงจันทร์จะคอยกล่อมให้เธอหลับฝันดีทุกคืน!"
  },
  {
    id: "clover",
    icon: "🍀",
    name: "โคลเวอร์ 4 แฉก",
    tag: "Lucky Clover",
    aspect: "โชคดี & ความบังเอิญ",
    forecast1: "ความรักจะมีเรื่องเซอร์ไพรส์น่ารักๆ เข้ามาทำให้ใจฟู มีโมเมนต์ดีๆ ให้ได้ยิ้มเขินกันบ่อยขึ้น",
    forecast2: "จะได้พบเจอทางออกที่ดีแบบบังเอิญ เจอคนช่วยเหลือถูกที่ถูกเวลา อุปสรรคกลายเป็นเรื่องง่าย",
    forecast3: "มีเกณฑ์รับทรัพย์รับโชค ลาภลอย หรือสุ่มจับรางวัลอะไรก็มักจะได้ของรางวัลที่ถูกใจ",
    thunderBlessing: "🍀 ใบไม้แห่งปาฏิหาริย์: โชคดีกำลังพัดพามาหาแบมๆ เตรียมเปิดใจรับสิ่งดีๆ ได้เลย!"
  },
  {
    id: "diamond",
    icon: "💎",
    name: "เพชรความมั่นคง",
    tag: "Solid Bond",
    aspect: "อนาคต & ความจริงใจ",
    forecast1: "สายใยความผูกพันจะยิ่งแน่นแฟ้น แผนการสร้างอนาคตร่วมกันจะเริ่มเห็นผลเป็นรูปเป็นร่างชัดเจน",
    forecast2: "ความมั่นคงในใจจะเพิ่มขึ้น มีความหนักแน่น ไม่หวั่นไหวกับคำพูดคนอื่น มั่นใจในตัวเองมากขึ้น",
    forecast3: "ฐานะการเงินและทรัพย์สินจะเติบโตมั่นคง มีรายรับเพิ่มขึ้นหรือได้ลงทุนในสิ่งที่มีค่า",
    thunderBlessing: "💎 อัญมณีแห่งความแข็งแกร่ง: หัวใจของแบมๆ แข็งแกร่งและงดงามดั่งเพชรน้ำหนึ่ง!"
  },
  {
    id: "blossom",
    icon: "🌸",
    name: "ซากุระผลิบาน",
    tag: "Spring Bloom",
    aspect: "เสน่ห์ & สิ่งใหม่ๆ",
    forecast1: "ความรักจะสดชื่นเหมือนฤดูใบไม้ผลิ มีความหวานน่ารักกลับมาเติมเต็มให้หัวใจกระชุ่มกระชวย",
    forecast2: "แบมๆ จะมีเสน่ห์ดึงดูด ใครเห็นก็เอ็นดู อารมณ์แจ่มใส ผิวพรรณสดใสขึ้นอย่างเห็นได้ชัด",
    forecast3: "การเริ่มต้นสิ่งใหม่ๆ ในปีนี้จะผลิดอกออกผลอย่างงดงาม นำพาความสุขระยะยาวมาให้",
    thunderBlessing: "🌸 ฤดูกาลแห่งการผลิบาน: ถึงเวลาที่แบมๆ จะได้เบ่งบานและมีความสุขอย่างเต็มที่แล้วนะ!"
  },
  {
    id: "hug",
    icon: "🧸",
    name: "อ้อมกอดแคร์แบร์",
    tag: "Care Hug",
    aspect: "ความอบอุ่น & ปลอดภัย",
    forecast1: "เวลาที่แบมๆ รู้สึกเหงา อ้อมกอดแห่งความรักและการดูแลเอาใจใส่จะคอยโอบอุ้มแบมๆ เสมอ",
    forecast2: "จะได้รับความรู้สึกปลอดภัยทางใจ มีที่พึ่งพิงที่ไว้ใจได้ ไม่ต้องแบกรับเรื่องหนักๆ คนเดียว",
    forecast3: "จะได้มิตรภาพและเพื่อนร่วมงานที่ดี คอยช่วยเหลือเกื้อกูลกันแบบอบอุ่นใจไร้ดราม่า",
    thunderBlessing: "🧸 อ้อมกอดเวทมนตร์: Thunder Heart และผองเพื่อนแคร์แบร์ส่งกอดนุ่มฟูมาให้แบมๆ นะ!"
  },
  {
    id: "tea",
    icon: "☕",
    name: "แก้วชาอุ่นใจ",
    tag: "Warm Peace",
    aspect: "ความสบายใจ & ผ่อนคลาย",
    forecast1: "ความสัมพันธ์จะเป็นพื้นที่เซฟโซนที่อบอุ่น เหนื่อยจากโลกภายนอกมาก็มีที่ให้พักพิงใจเสมอ",
    forecast2: "จะได้มีเวลาชิลๆ ทำสิ่งที่รัก จิบเครื่องดื่มอร่อยๆ ไม่ต้องเร่งรีบใช้ชีวิตแบบกดดัน",
    forecast3: "ความใจเย็นและสติจะช่วยให้แบมๆ แคล้วคลาดจากปัญหา และดึงดูดโอกาสดีๆ เข้ามาเอง",
    thunderBlessing: "☕ ชาอุ่นแห่งความสงบ: ผ่อนคลายนะ ปล่อยความเหนื่อยล้าทิ้งไป แล้วสูดลมหายใจรับความสุขเข้ามา!"
  },
  {
    id: "flight",
    icon: "✈️",
    name: "ตั๋วทริปเปิดโลก",
    tag: "Wanderlust",
    aspect: "การเดินทาง & พักผ่อน",
    forecast1: "ความรักจะมีช่วงเวลาแห่งการเดินทางและการพักผ่อน ได้ไปเปิดหูเปิดตาและสร้างความทรงจำดีๆ ร่วมกัน",
    forecast2: "จะได้เดินทางไปในสถานที่ใหม่ๆ ที่ช่วยชาร์จพลังชีวิตและเปิดมุมมองให้สดชื่นเต็มร้อย",
    forecast3: "การเดินทางในปีนี้จะราบรื่น ปลอดภัย และอาจนำพาโชคลาภหรือไอเดียดีๆ กลับมาด้วย",
    thunderBlessing: "✈️ สายลมแห่งการผจญภัย: ปีกแห่งสายฟ้าจะพัดพาแบมๆ ไปพบกับโลกกว้างและความสุขใหม่ๆ!"
  },
  {
    id: "gift",
    icon: "🎁",
    name: "กล่องของขวัญ",
    tag: "Special Gift",
    aspect: "เซอร์ไพรส์ & โชคดี",
    forecast1: "จะได้พบเจอความใส่ใจและเรื่องเซอร์ไพรส์ดีๆ จากคนข้างกายที่ทำให้หัวใจฟูฟ่อง",
    forecast2: "ชีวิตจะมีเรื่องน่ายินดีเข้ามาเรื่อยๆ สิ่งที่เคยคิดว่ายากจะกลายเป็นของขวัญที่คุ้มค่าเหนื่อย",
    forecast3: "มีเกณฑ์ได้สิ่งของชิ้นใหญ่หรือของที่อยากได้มานาน และจะได้มาในจังหวะเวลาที่ลงตัวที่สุด",
    thunderBlessing: "🎁 ของขวัญแห่งชะตา: จักรวาลกำลังเตรียมห่อของขวัญชิ้นพิเศษไว้ให้แบมๆ ในปีนี้!"
  },
  {
    id: "crystal",
    icon: "🔮",
    name: "ลูกแก้วเวทมนตร์",
    tag: "Crystal Vision",
    aspect: "สัญชาตญาณแม่นยำ",
    forecast1: "เซ้นส์เรื่องความสัมพันธ์จะเฉียบคม แบมๆ จะสัมผัสได้ถึงความจริงใจและเจตนาที่ดีงามอย่างลึกซึ้ง",
    forecast2: "สัญชาตญาณแม่นยำ การตัดสินใจส่วนตัวจะถูกต้องเป๊ะ และพาตัวเองไปอยู่ในจุดที่ดีเสมอ",
    forecast3: "มีลางสังหรณ์แม่นยำเรื่องโชคลาภ อาจมีโชคจากการเสี่ยงทายหรือการเลือกตามความรู้สึก",
    thunderBlessing: "🔮 ลูกแก้วพยากรณ์: เชื่อมั่นในเสียงกระซิบจากหัวใจของตัวเองนะ แบมๆ มีสัญชาตญาณที่ดีเยี่ยม!"
  },
  {
    id: "cake",
    icon: "🍰",
    name: "สตรอว์เบอร์รีเค้ก",
    tag: "Sweet Joy",
    aspect: "ความหวาน & อร่อยใจ",
    forecast1: "ความรักจะหอมหวาน มีคำพูดน่ารักๆ และการดูแลเอาใจใส่ที่ทำให้ยิ้มไม่หุบ",
    forecast2: "จะได้กินของอร่อยบ่อยๆ ได้ลิ้มลองเมนูโปรด และมีความสุขกับอาหารการกินอย่างสบายใจ",
    forecast3: "จะมีงานเฉลิมฉลองและข่าวดีในครอบครัวหรือเรื่องงานเข้ามาให้ได้ฉลองกันอย่างมีความสุข",
    thunderBlessing: "🍰 ความสุขรสหวาน: ขอให้ชีวิตในปีนี้ของแบมๆ หวานละมุนและอร่อยใจเหมือนเค้กชิ้นโปรด!"
  },
  {
    id: "shield",
    icon: "🛡️",
    name: "โล่พิทักษ์สายฟ้า",
    tag: "Guardian Shield",
    aspect: "ความปลอดภัย & คุ้มครอง",
    forecast1: "ความสัมพันธ์จะได้รับการปกป้องจากเรื่องแย่ๆ มีคนคอยเป็นเกราะกำบังและพร้อมช่วยเหลือเสมอ",
    forecast2: "แคล้วคลาดปลอดภัยจากเรื่องร้าย คนไม่จริงใจจะแพ้ภัยตัวเอง ไม่สามารถทำอะไรแบมๆ ได้",
    forecast3: "สุขภาพจะแข็งแรง โรคภัยไข้เจ็บไม่กล้ำกราย ปลอดโปร่งและปลอดภัยตลอดทั้งปี",
    thunderBlessing: "🛡️ เกราะสายฟ้าพิทักษ์: Thunder Heart จะคอยกางโล่สายฟ้าปกป้องแบมๆ ให้ปลอดภัยเสมอ!"
  },
  {
    id: "wealth",
    icon: "💰",
    name: "กระเป๋าทรัพย์มั่งคั่ง",
    tag: "Abundance",
    aspect: "การเงินคล่องตัว",
    forecast1: "ความมั่นคงทางการเงินจะช่วยเกื้อหนุนให้ชีวิตคู่ราบรื่น มีแผนเก็บออมที่เติบโตต่อเนื่อง",
    forecast2: "การเงินของแบมๆ จะคล่องตัวมาก มีเงินเข้ามาหลายทาง ช้อปปิ้งซื้อของที่อยากได้ได้อย่างสบายใจ",
    forecast3: "จะมีเงินก้อนพิเศษเข้ามา หรือผลตอบแทนจากการงานจะคุ้มค่าเหนื่อยเกินคาด",
    thunderBlessing: "💰 ขุมทรัพย์แห่งดวงดาว: ขอให้ความมั่งคั่งและโชคลาภหลั่งไหลเข้ามาสู่กระเป๋าของแบมๆ ตลอดปี!"
  },
  {
    id: "balloon",
    icon: "🎈",
    name: "ลูกโป่งใจเบา",
    tag: "Light Heart",
    aspect: "การปล่อยวาง & สดชื่น",
    forecast1: "เรื่องขุ่นเคืองใจเล็กๆ น้อยๆ จะปล่อยวางได้ง่าย ปรับความเข้าใจกันได้รวดเร็วและอบอุ่นใจ",
    forecast2: "หัวใจจะเบาสบาย ไม่เก็บเรื่องรกสมองมาคิดมาก มีอิสระและมีความสุขกับสิ่งรอบตัวง่ายขึ้น",
    forecast3: "โอกาสดีๆ จะลอยเข้ามาหาอย่างเป็นธรรมชาติ ชีวิตลื่นไหล ไม่ติดขัด",
    thunderBlessing: "🎈 ลอยละล่องสู่ฟ้ากว้าง: ปล่อยเรื่องหนักๆ ให้ลอยไปกับลูกโป่ง แล้วโบยบินสู่ความสุขนะแบมๆ!"
  },
  {
    id: "crown",
    icon: "👑",
    name: "มงกุฎเจ้าหญิง",
    tag: "Princess Crown",
    aspect: "ความภาคภูมิใจ & สง่างาม",
    forecast1: "ในสายตาของคนที่รัก แบมๆ จะเป็นคนสำคัญอันดับหนึ่งเสมอ ได้รับเกียรติและการดูแลอย่างทะนุถนอม",
    forecast2: "ปีนี้แบมๆ จะภูมิใจในตัวเองมาก จะได้เห็นคุณค่าและความเก่งของตัวเองชัดเจนยิ่งขึ้น",
    forecast3: "จะได้รับเกียรติและตำแหน่งที่ดี ได้รับคำยกย่องชื่นชม และเป็นปีที่โดดเด่นเปล่งประกายที่สุด",
    thunderBlessing: "👑 มงกุฎแห่งราศีตุลย์: แบมๆ คือราชินีแห่งดวงดาวของราศีตุลย์ จงสวมมงกุฎและก้าวไปข้างหน้าอย่างสง่างาม!"
  }
];

// Frame Themes for Photo Booth
const frameThemes = {
  rainbow: {
    banner: "HBD BAM-BAM 🌈",
    wish: "สุขสันต์วันเกิดนะแบมๆ 💖",
    bearTL: "assets/carebears/funshine-umbrella.png",
    bearTR: "assets/carebears/star-swing.png",
    bearBL: "assets/carebears/bedtime-hearts.png",
    bearBR: "assets/carebears/bestfriend-wave.png",
    borderColor: "#FFD166",
    bgColor: "#FFFDF5"
  },
  pinklove: {
    banner: "BAM-BAM & KHAO 💕",
    wish: "ถึงพูดไม่ค่อยเก่ง แต่รักแบมๆ เสมอนะ",
    bearTL: "assets/carebears/bestfriend-wave.png",
    bearTR: "assets/carebears/friend-swing.png",
    bearBL: "assets/carebears/bedtime-hearts.png",
    bearBR: "assets/carebears/harmony-cloud.png",
    borderColor: "#FF85C0",
    bgColor: "#FFF0F5"
  },
  grumpy: {
    banner: "หน้างอก็บอกเค้าตรงๆ นะ 🌧️",
    wish: "ง้อไม่ค่อยเป็น แต่พร้อมรับฟังเสมอ 🐻",
    bearTL: "assets/carebears/grumpy-front.png",
    bearTR: "assets/carebears/grumpy-standing.png",
    bearBL: "assets/carebears/oopsy-skate-hd.png",
    bearBR: "assets/carebears/funshine-run.png",
    borderColor: "#70D6FF",
    bgColor: "#F0F8FF"
  },
  bedtime: {
    banner: "GOOD NIGHT BAM-BAM 🌙",
    wish: "อย่าลืมนอนไวๆ พักผ่อนเยอะๆ นะคะ",
    bearTL: "assets/carebears/bedtime-sleep.png",
    bearTR: "assets/carebears/star-swing.png",
    bearBL: "assets/carebears/harmony-cloud.png",
    bearBR: "assets/carebears/bedtime-hearts.png",
    borderColor: "#B388EB",
    bgColor: "#F9F5FF"
  }
};

/* ================= WEB AUDIO SYNTHESIZER (CUTE BGM & SFX) ================= */
class CuteAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingBGM = false;
    this.bgmTimer = null;
    this.melodyNoteIndex = 0;
    
    // Notes for "Happy Birthday" melody (Frequencies in Hz)
    // C4, C4, D4, C4, F4, E4 | C4, C4, D4, C4, G4, F4 | C4, C4, C5, A4, F4, E4, D4 | Bb4, Bb4, A4, F4, G4, F4
    this.birthdayNotes = [
      { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.1 },
      { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.1 },
      { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 523.25, d: 0.6 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 0.6 }, { f: 293.66, d: 0.9 },
      { f: 466.16, d: 0.3 }, { f: 466.16, d: 0.3 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.4 }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft Music-box note synth
  playMusicBoxNote(freq, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Cute chime overtone
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration * 0.8);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    gain.connect(this.ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(this.ctx.currentTime + duration);
    osc2.stop(this.ctx.currentTime + duration);
  }

  startBGM() {
    this.init();
    if (this.isPlayingBGM) return;
    this.isPlayingBGM = true;
    this.melodyNoteIndex = 0;
    this.scheduleNextNote();
  }

  scheduleNextNote() {
    if (!this.isPlayingBGM) return;
    const note = this.birthdayNotes[this.melodyNoteIndex];
    this.playMusicBoxNote(note.f, note.d);

    this.melodyNoteIndex = (this.melodyNoteIndex + 1) % this.birthdayNotes.length;
    const delay = (note.d * 1000) + 120;
    this.bgmTimer = setTimeout(() => this.scheduleNextNote(), delay);
  }

  stopBGM() {
    this.isPlayingBGM = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // SFX: Cute Pop sound
  playPop() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // SFX: Camera Shutter Click
  playCameraShutter() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);

    // Second click
    setTimeout(() => {
      if (!this.ctx) return;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(500, this.ctx.currentTime);
      gain2.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start();
      osc2.stop(this.ctx.currentTime + 0.08);
    }, 120);
  }

  // SFX: Candle Blow Whoosh
  playBlowWhoosh() {
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    whiteNoise.start();
  }

  // SFX: Celebration Fanfare Chime
  playFanfare() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(freq, 0.5);
      }, idx * 130);
    });
  }

  // SFX: Tarot Card Shuffle Swish
  playShuffleSound() {
    this.init();
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300 + Math.random() * 250, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      }, i * 140);
    }
  }

  // SFX: Tarot Card Reveal Flip
  playCardFlip() {
    this.init();
    this.playMusicBoxNote(587.33, 0.35); // D5
    setTimeout(() => {
      this.playMusicBoxNote(880.00, 0.45); // A5
    }, 120);
  }
}

const audio = new CuteAudioEngine();

/* ================= CONFETTI & PARTICLES ================= */
class ConfettiEngine {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  blast(x, y, count = 70) {
    const colors = ['#FF69B4', '#FFD700', '#70D6FF', '#B388EB', '#4ECDC4', '#FF85C0', '#FFE66D'];
    const shapes = ['circle', 'rect', 'heart'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      this.particles.push({
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'heart') {
        this.drawHeart(0, 0, p.size);
      }

      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }

  drawHeart(x, y, size) {
    const s = size * 0.7;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + s / 4);
    this.ctx.quadraticCurveTo(x, y, x + s / 2, y);
    this.ctx.quadraticCurveTo(x + s, y, x + s, y + s / 2);
    this.ctx.quadraticCurveTo(x + s, y + s, x, y + s * 1.3);
    this.ctx.quadraticCurveTo(x - s, y + s, x - s, y + s / 2);
    this.ctx.quadraticCurveTo(x - s, y, x - s / 2, y);
    this.ctx.quadraticCurveTo(x, y, x, y + s / 4);
    this.ctx.fill();
  }
}

let confetti;

/* ================= BACKGROUND CLOUDS & STARS ================= */
function initBackgroundAtmosphere() {
  const cloudsContainer = document.getElementById('bgClouds');
  const starsContainer = document.getElementById('bgStars');

  // Spawn 6 clouds with staggered delays
  for (let i = 0; i < 6; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud-particle';
    const width = Math.random() * 120 + 90;
    const height = width * 0.55;
    cloud.style.width = `${width}px`;
    cloud.style.height = `${height}px`;
    cloud.style.top = `${Math.random() * 85}vh`;
    cloud.style.animationDuration = `${Math.random() * 25 + 25}s`;
    cloud.style.animationDelay = `${Math.random() * -30}s`;
    cloudsContainer.appendChild(cloud);
  }

  // Spawn 22 twinkling stars
  const starSymbols = ['✨', '⭐', '💫', '🌸'];
  for (let i = 0; i < 22; i++) {
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
    star.style.left = `${Math.random() * 95}vw`;
    star.style.top = `${Math.random() * 95}vh`;
    star.style.fontSize = `${Math.random() * 14 + 10}px`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    starsContainer.appendChild(star);
  }
}

/* ================= SCENE NAVIGATION ================= */
function switchScene(targetIndex) {
  if (targetIndex < 1 || targetIndex > appState.totalScenes) return;

  const currentSceneEl = document.getElementById(`scene${appState.currentScene}`);
  const targetSceneEl = document.getElementById(`scene${targetIndex}`);

  if (currentSceneEl) currentSceneEl.classList.remove('active');
  if (targetSceneEl) targetSceneEl.classList.add('active');

  appState.currentScene = targetIndex;

  // Update top progress stepper
  const dots = document.querySelectorAll('.step-dot');
  dots.forEach(dot => {
    const step = parseInt(dot.getAttribute('data-step'), 10);
    dot.classList.remove('active', 'completed');
    if (step === targetIndex) {
      dot.classList.add('active');
    } else if (step < targetIndex) {
      dot.classList.add('completed');
    }
  });

  const progressBarFill = document.getElementById('progressBarFill');
  const percent = ((targetIndex - 1) / (appState.totalScenes - 1)) * 100;
  progressBarFill.style.width = `${Math.max(14, percent)}%`;

  // Play navigation pop sound
  audio.playPop();

  // Scroll to top of window smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Camera cleanup if leaving scene 3
  if (targetIndex !== 3 && appState.herStream) {
    stopHerCameraStream();
  }
}

/* ================= SCENE 1: GIFT BOX ================= */
function initGiftBox() {
  const giftBoxWrapper = document.getElementById('giftBoxWrapper');
  const boxLid = document.querySelector('.box-lid');

  giftBoxWrapper.addEventListener('click', () => {
    audio.playPop();
    boxLid.classList.add('opened');

    // Confetti burst from box
    const rect = giftBoxWrapper.getBoundingClientRect();
    confetti.blast(rect.left + rect.width / 2, rect.top + rect.height / 3, 90);

    // Auto-start BGM if not already playing
    if (!appState.isAudioPlaying) {
      toggleBGM();
    }

    setTimeout(() => {
      switchScene(2);
    }, 1100);
  });
}

/* ================= SCENE 3: DUO FUN POLAROID ENVELOPE ================= */
function initDuoEnvelopeAndPolaroid() {
  const envelopeStage = document.getElementById('duoEnvelopeStage');
  const envelopeBox = document.getElementById('duoEnvelopeBox');
  const duoTapHint = document.getElementById('duoTapHint');
  const duoPolaroidBoard = document.getElementById('duoPolaroidBoard');
  const duoResultCard = document.getElementById('duoResultCard');

  // His Elements
  const hisPhotoImg = document.getElementById('hisPhotoImg');
  const hisPhotoPlaceholder = document.getElementById('hisPhotoPlaceholder');
  const hisPhotoFileInput = document.getElementById('hisPhotoFileInput');

  // Her Elements
  const herWebcamVideo = document.getElementById('herWebcamVideo');
  const herPhotoImg = document.getElementById('herPhotoImg');
  const herPhotoPlaceholder = document.getElementById('herPhotoPlaceholder');
  const duoShutterFlash = document.getElementById('duoShutterFlash');
  const duoCountdownOverlay = document.getElementById('duoCountdownOverlay');
  const duoStartCamBtn = document.getElementById('duoStartCamBtn');
  const duoSnapBtn = document.getElementById('duoSnapBtn');
  const herPhotoFileInput = document.getElementById('herPhotoFileInput');
  const duoRetakeBtn = document.getElementById('duoRetakeBtn');
  const downloadDuoBtn = document.getElementById('downloadDuoBtn');

  // 1. Guarantee 24427.jpg is displayed for his photo
  if (!appState.hisPhotoData) {
    appState.hisPhotoData = '24427.jpg';
  }
  displayHisPhoto(appState.hisPhotoData);

  function displayHisPhoto(dataUrl) {
    appState.hisPhotoData = dataUrl;
    if (hisPhotoImg) {
      hisPhotoImg.src = dataUrl;
      hisPhotoImg.style.display = 'block';
    }
    if (hisPhotoPlaceholder) {
      hisPhotoPlaceholder.style.display = 'none';
    }

    const imgObj = new Image();
    imgObj.onload = () => {
      appState.hisImageObj = imgObj;
    };
    imgObj.onerror = () => {
      // Fallback if needed
      if (dataUrl !== '24427.jpg') {
        imgObj.src = '24427.jpg';
      }
    };
    imgObj.src = dataUrl;

    checkDuoReady();
  }

  // His Photo File Input
  hisPhotoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    audio.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      try {
        localStorage.setItem('bamsDay_hisPhoto', dataUrl);
      } catch (err) {
        console.warn('Storage quota warning:', err);
      }
      displayHisPhoto(dataUrl);
      audio.playFanfare();
      confetti.blast(window.innerWidth / 2, window.innerHeight / 2, 45);
    };
    reader.readAsDataURL(file);
  });

  // 2. Open Envelope Tap
  function openEnvelope() {
    if (appState.isEnvelopeOpened) return;
    appState.isEnvelopeOpened = true;

    audio.playPop();
    envelopeBox.classList.add('opened');
    duoTapHint.style.display = 'none';

    // Confetti burst from envelope
    const rect = envelopeBox.getBoundingClientRect();
    confetti.blast(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

    setTimeout(() => {
      duoPolaroidBoard.style.display = 'block';
      audio.playFanfare();
      duoPolaroidBoard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
  }

  envelopeStage.addEventListener('click', openEnvelope);

  // 3. Her Camera Controls
  duoStartCamBtn.addEventListener('click', async () => {
    audio.playPop();
    try {
      if (appState.herStream) {
        stopHerCameraStream();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      appState.herStream = stream;
      herWebcamVideo.srcObject = stream;
      herWebcamVideo.style.display = 'block';
      herPhotoPlaceholder.style.display = 'none';
      herPhotoImg.style.display = 'none';

      duoStartCamBtn.style.display = 'none';
      duoSnapBtn.style.display = 'inline-flex';
      duoRetakeBtn.style.display = 'none';

    } catch (err) {
      console.warn("Camera access denied:", err);
      alert("ไม่สามารถเปิดกล้องได้นะ (อาจยังไม่ได้อนุญาตให้ใช้กล้อง) สามารถกด 'เลือกรูปจากเครื่อง' เพื่อเลือกรูปหน้าปั่นๆ น่ารักๆ มาใส่แทนได้เลยค่ะ! 💖");
    }
  });

  // Her Countdown & Snap
  duoSnapBtn.addEventListener('click', () => {
    if (!appState.herStream) return;

    duoSnapBtn.disabled = true;
    let count = 3;
    duoCountdownOverlay.textContent = count;
    duoCountdownOverlay.classList.add('counting');
    audio.playPop();

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        duoCountdownOverlay.textContent = count;
        audio.playPop();
      } else {
        clearInterval(timer);
        duoCountdownOverlay.classList.remove('counting');
        takeHerSnapshot();
      }
    }, 1000);
  });

  function takeHerSnapshot() {
    duoShutterFlash.classList.add('flash-active');
    setTimeout(() => duoShutterFlash.classList.remove('flash-active'), 400);
    audio.playCameraShutter();

    const canvas = document.createElement('canvas');
    canvas.width = herWebcamVideo.videoWidth || 640;
    canvas.height = herWebcamVideo.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    // Mirror user-facing camera
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(herWebcamVideo, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    displayHerPhoto(dataUrl);
    stopHerCameraStream();
  }

  // Her File Upload
  herPhotoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    audio.playPop();
    stopHerCameraStream();

    const reader = new FileReader();
    reader.onload = (event) => {
      displayHerPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
  });

  function displayHerPhoto(dataUrl) {
    appState.herPhotoData = dataUrl;
    herPhotoImg.src = dataUrl;
    herPhotoImg.style.display = 'block';
    herWebcamVideo.style.display = 'none';
    herPhotoPlaceholder.style.display = 'none';

    duoSnapBtn.style.display = 'none';
    duoSnapBtn.disabled = false;
    duoStartCamBtn.style.display = 'none';
    duoRetakeBtn.style.display = 'inline-flex';

    const imgObj = new Image();
    imgObj.onload = () => {
      appState.herImageObj = imgObj;
    };
    imgObj.src = dataUrl;

    audio.playFanfare();
    confetti.blast(window.innerWidth / 2, window.innerHeight * 0.45, 60);

    checkDuoReady();
  }

  // Her Retake
  duoRetakeBtn.addEventListener('click', () => {
    audio.playPop();
    appState.herPhotoData = null;
    appState.herImageObj = null;
    herPhotoImg.style.display = 'none';
    herPhotoPlaceholder.style.display = 'flex';
    duoRetakeBtn.style.display = 'none';
    duoStartCamBtn.style.display = 'inline-flex';
    duoResultCard.style.display = 'none';
  });

  function checkDuoReady() {
    if (appState.herPhotoData) {
      duoResultCard.style.display = 'block';
      duoResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // 4. Download Duo Keepsake Button
  downloadDuoBtn.addEventListener('click', () => {
    audio.playPop();
    renderDuoCanvasAndDownload();
  });
}

function stopHerCameraStream() {
  if (appState.herStream) {
    appState.herStream.getTracks().forEach(track => track.stop());
    appState.herStream = null;
  }
}

/* ================= RENDER MERGED DUO POLAROID CANVAS & DOWNLOAD ================= */
async function renderDuoCanvasAndDownload() {
  await ensureFontsLoaded();
  const canvas = document.getElementById('hiddenDuoCanvas');
  const ctx = canvas.getContext('2d');

  // High resolution square format: 1080 x 1080
  const W = 1080;
  const H = 1080;
  canvas.width = W;
  canvas.height = H;
  ctx.direction = 'ltr';

  // 1. Background gradient (Soft pastel rainbow Care Bears atmosphere)
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#FFF0F5');
  bgGrad.addColorStop(0.35, '#FFF9E6');
  bgGrad.addColorStop(0.7, '#F0F8FF');
  bgGrad.addColorStop(1, '#F3E5F5');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Border frame
  ctx.strokeStyle = '#FFB6C1';
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, W - 16, H - 16);

  // Helper to load image for canvas
  const loadImage = (src) => new Promise(res => {
    if (!src) return res(null);
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });

  // Load Care Bears decor assets
  const [bearStar, bearUmbrella, bearWave, bearHearts] = await Promise.all([
    loadImage('assets/carebears/star-swing.png'),
    loadImage('assets/carebears/funshine-umbrella.png'),
    loadImage('assets/carebears/bestfriend-wave.png'),
    loadImage('assets/carebears/bedtime-hearts.png')
  ]);

  // Corner decorations
  if (bearStar) ctx.drawImage(bearStar, 24, 24, 130, 130);
  if (bearUmbrella) ctx.drawImage(bearUmbrella, W - 150, 24, 130, 130);
  if (bearWave) ctx.drawImage(bearWave, 24, H - 160, 135, 135);
  if (bearHearts) ctx.drawImage(bearHearts, W - 150, H - 160, 135, 135);

  // 2. Top Header Banner
  const bannerW = 720;
  const bannerH = 68;
  const bannerX = (W - bannerW) / 2;
  const bannerY = 45;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FF4081';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 34);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#C2185B';
  ctx.font = 'bold 30px Fredoka, Mali, sans-serif';
  drawCenteredText(ctx, '🌈 HBD BAM-BAM • คู่หูตัวตึง Care-a-Lot 💖', W / 2, bannerY + 45);

  // Helper function to draw a single polaroid card
  function drawPolaroidCard(cx, cy, cardW, cardH, angleDeg, photoImg, titleText, subText, ribbonBg, ribbonText, isBoy) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angleDeg * Math.PI) / 180);

    // Card white background & shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
    ctx.shadowColor = 'transparent';

    // Card border
    ctx.strokeStyle = '#FFE4E8';
    ctx.lineWidth = 4;
    ctx.strokeRect(-cardW / 2, -cardH / 2, cardW, cardH);

    // Pushpin at top
    ctx.fillStyle = isBoy ? '#7E57C2' : '#FF4081';
    ctx.beginPath();
    ctx.arc(0, -cardH / 2 + 16, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Top Ribbon tag
    const ribW = 190;
    const ribH = 30;
    ctx.fillStyle = ribbonBg;
    ctx.beginPath();
    ctx.roundRect(-ribW / 2, -cardH / 2 + 32, ribW, ribH, 15);
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Mali, sans-serif';
    drawCenteredText(ctx, ribbonText, 0, -cardH / 2 + 53);

    // Inner photo frame
    const pW = cardW - 40;
    const pH = cardH - 150;
    const pX = -pW / 2;
    const pY = -cardH / 2 + 72;

    if (photoImg) {
      // Cover crop draw
      const imgRatio = photoImg.width / photoImg.height;
      const boxRatio = pW / pH;
      let sW, sH, sX, sY;

      if (imgRatio > boxRatio) {
        sH = photoImg.height;
        sW = photoImg.height * boxRatio;
        sX = (photoImg.width - sW) / 2;
        sY = 0;
      } else {
        sW = photoImg.width;
        sH = photoImg.width / boxRatio;
        sX = 0;
        sY = (photoImg.height - sH) / 2;
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(pX, pY, pW, pH);
      ctx.clip();
      ctx.drawImage(photoImg, sX, sY, sW, sH, pX, pY, pW, pH);
      ctx.restore();
    } else {
      // Placeholder drawing
      ctx.fillStyle = isBoy ? '#EDE7F6' : '#FCE4EC';
      ctx.fillRect(pX, pY, pW, pH);

      ctx.fillStyle = isBoy ? '#5E35B1' : '#C2185B';
      ctx.font = 'bold 44px sans-serif';
      drawCenteredText(ctx, isBoy ? '🐻🛠️' : '😜📸', 0, pY + pH / 2 - 10);

      ctx.font = 'bold 20px Mali, sans-serif';
      drawCenteredText(ctx, isBoy ? 'รูปหน้าเค้า' : 'ตาแบมๆ แล้ว!', 0, pY + pH / 2 + 35);
    }

    // Photo border
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 2;
    ctx.strokeRect(pX, pY, pW, pH);

    // Bottom Captions
    ctx.fillStyle = '#C2185B';
    ctx.font = 'bold 22px Fredoka, Mali, sans-serif';
    drawCenteredText(ctx, titleText, 0, pY + pH + 34);

    ctx.fillStyle = '#5D4037';
    ctx.font = '16px Mali, sans-serif';
    drawCenteredText(ctx, subText, 0, pY + pH + 60);

    ctx.restore();
  }

  // Ensure images are loaded before drawing
  if (!appState.hisImageObj && appState.hisPhotoData) {
    appState.hisImageObj = await loadImage(appState.hisPhotoData);
  }
  if (!appState.herImageObj && appState.herPhotoData) {
    appState.herImageObj = await loadImage(appState.herPhotoData);
  }

  // Draw Left Polaroid: His Photo (cx: 295, cy: 500, w: 420, h: 560, rot: -3deg)
  drawPolaroidCard(
    295, 500, 420, 560, -3,
    appState.hisImageObj,
    'วิศวกรปากจู๋ 😚🛠️',
    'เค้าเอง (ฉบับปากจู๋ 😚)',
    '#5E35B1',
    'วิศวกรปากจู๋ 😚',
    true
  );

  // Draw Right Polaroid: Her Photo (cx: 785, cy: 500, w: 420, h: 560, rot: 3deg)
  drawPolaroidCard(
    785, 500, 420, 560, 3,
    appState.herImageObj,
    'แบมๆ หน้าปั่น 🤪',
    'ตัวป่วนประจำตัวเค้า 💖',
    '#E91E63',
    'แบมๆ ตัวป่วน 💖',
    false
  );

  // Center Comic Heart Connector
  ctx.save();
  ctx.shadowColor = 'rgba(255, 64, 129, 0.4)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FF4081';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W / 2, 490, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = '36px sans-serif';
  ctx.textBaseline = 'middle';
  drawCenteredText(ctx, '💖', W / 2, 490);
  ctx.restore();

  // 3. Bottom Romantic Quote Banner
  const footW = 860;
  const footH = 92;
  const footX = (W - footW) / 2;
  const footY = H - 150;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FF85C0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(footX, footY, footW, footH, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D81B60';
  ctx.font = 'bold 22px Mali, sans-serif';
  drawCenteredText(ctx, '"เพราะเค้าอยากเคลียร์ปัญหาต่างๆ ให้เราได้มีเวลาด้วยกัน..."', W / 2, footY + 40);

  ctx.fillStyle = '#8E24AA';
  ctx.font = 'bold 17px Fredoka, Mali, sans-serif';
  drawCenteredText(ctx, 'Bam-Bam & Khao • Birthday Keepsake 💖', W / 2, footY + 70);

  // 4. iOS & iPad Friendly Export (Web Share API + In-App Modal)
  showCanvasInModal(
    canvas,
    'Bam-Bam-Khao-Duo-Polaroid.png',
    'รูปคู่หน้าปั่นๆ แบมๆ & เค้า 💖📸',
    'สุขสันต์วันเกิดนะ แบมๆ 💖 จากเค้าเองนะ'
  );
}

/* ================= SCENE 4: CAKE & BLOW CANDLE ================= */
function initCakeScene() {
  const blowBtn = document.getElementById('blowBtn');
  const candleWrapper = document.getElementById('candleWrapper');
  const flame = document.getElementById('flame');
  const smoke = document.getElementById('smoke');
  const wishSuccessCard = document.getElementById('wishSuccessCard');

  let isBlown = false;

  function extinguishCandle() {
    if (isBlown) return;
    isBlown = true;

    audio.playBlowWhoosh();
    flame.classList.add('blown-out');
    smoke.classList.add('show-smoke');

    setTimeout(() => {
      audio.playFanfare();
      const rect = candleWrapper.getBoundingClientRect();
      confetti.blast(rect.left + rect.width / 2, rect.top, 120);
      wishSuccessCard.style.display = 'block';
      blowBtn.innerHTML = '<span>✨</span> คำอธิษฐานส่งถึงสวรรค์แล้ว!';
      blowBtn.style.background = '#4CAF50';
    }, 450);
  }

  blowBtn.addEventListener('click', extinguishCandle);
  candleWrapper.addEventListener('click', extinguishCandle);
}

/* ================= REUSABLE MODAL & CANVAS UTILITIES ================= */
async function ensureFontsLoaded() {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
      await Promise.allSettled([
        document.fonts.load('bold 24px Mali'),
        document.fonts.load('bold 24px Fredoka'),
        document.fonts.load('20px Mali'),
        document.fonts.load('20px Fredoka')
      ]);
    } catch (e) {
      console.warn('Font loading check:', e);
    }
  }
}

function drawCenteredText(ctx, text, centerX, y) {
  if (text === undefined || text === null) return;
  const str = String(text);
  if (!str) return;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  const metrics = ctx.measureText(str);
  const startX = Math.round(centerX - (metrics.width / 2));
  ctx.fillText(str, startX, y);
  ctx.restore();
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function showCanvasInModal(canvas, defaultFilename, modalTitle, shareText) {
  const dataUrl = canvas.toDataURL('image/png');
  const iosModal = document.getElementById('iosPhotoModal');
  const iosModalTitle = document.getElementById('iosModalTitle');
  const iosModalImg = document.getElementById('iosModalImg');
  const iosShareBtn = document.getElementById('iosShareBtn');
  const iosDirectDownloadBtn = document.getElementById('iosDirectDownloadBtn');
  const closeIosModalBtn = document.getElementById('closeIosModalBtn');

  if (iosModalTitle && modalTitle) {
    iosModalTitle.textContent = modalTitle;
  }
  if (iosModalImg) {
    iosModalImg.src = dataUrl;
  }

  canvas.toBlob(async (blob) => {
    const file = new File([blob], defaultFilename, { type: 'image/png' });

    if (iosModal) {
      iosModal.classList.add('open');
    }

    if (iosShareBtn) {
      iosShareBtn.onclick = async () => {
        audio.playPop();
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: modalTitle || "Care Bears Birthday 💖",
              text: shareText || "สุขสันต์วันเกิดนะ แบมๆ 💖"
            });
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.log('Share error or canceled:', err);
            }
          }
        } else {
          const link = document.createElement('a');
          link.download = defaultFilename;
          link.href = dataUrl;
          link.click();
        }
      };
    }

    if (iosDirectDownloadBtn) {
      iosDirectDownloadBtn.onclick = () => {
        audio.playPop();
        const link = document.createElement('a');
        link.download = defaultFilename;
        link.href = dataUrl;
        link.click();
      };
    }

    if (closeIosModalBtn) {
      closeIosModalBtn.onclick = () => {
        audio.playPop();
        if (iosModal) iosModal.classList.remove('open');
      };
    }

    if (iosModal) {
      iosModal.onclick = (e) => {
        if (e.target === iosModal) {
          iosModal.classList.remove('open');
        }
      };
    }
  }, 'image/png');

  confetti.blast(window.innerWidth / 2, window.innerHeight / 2, 70);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, isCenter = false) {
  if (!text) return y;
  const str = String(text);

  ctx.save();
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';

  let tokens = [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
      tokens = Array.from(segmenter.segment(str), s => s.segment);
    } catch (e) {
      tokens = Array.from(str);
    }
  } else {
    tokens = str.split(/(\s+)/);
  }

  const lines = [];
  let currentLine = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const testLine = currentLine + token;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = token;
    } else if (testWidth > maxWidth && currentLine.length === 0) {
      const chars = Array.from(token);
      let subLine = '';
      for (let c = 0; c < chars.length; c++) {
        if (ctx.measureText(subLine + chars[c]).width > maxWidth && subLine.length > 0) {
          lines.push(subLine);
          subLine = chars[c];
        } else {
          subLine += chars[c];
        }
      }
      currentLine = subLine;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  let curY = y;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      curY += lineHeight;
      continue;
    }
    if (isCenter) {
      const lineMetrics = ctx.measureText(line);
      const startX = Math.round(x - (lineMetrics.width / 2));
      ctx.fillText(line, startX, curY);
    } else {
      ctx.fillText(line, x, curY);
    }
    curY += lineHeight;
  }

  ctx.restore();
  return curY;
}

/* ================= TAROT CANVAS RENDERING ================= */
async function renderTarotCardImage(cardData, slotIndex) {
  await ensureFontsLoaded();
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');
  ctx.direction = 'ltr';

  const slotTitle = slotIndex === 1
    ? 'ความรัก & คนข้างกาย 💕'
    : (slotIndex === 2 ? 'พลังใจ & การใช้ชีวิต ☀️' : 'พรพิเศษประจำปี 🌟');

  // Dreamy Care Bears Light Pastel Sunrise Gradient
  const grad = ctx.createLinearGradient(0, 0, 800, 1200);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.2, '#FFF0F5');
  grad.addColorStop(0.6, '#FFF8E7');
  grad.addColorStop(1, '#FCE4EC');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1200);

  // Sparkle stars in dreamy background
  ctx.fillStyle = 'rgba(255, 140, 180, 0.5)';
  for (let i = 0; i < 50; i++) {
    const sx = Math.sin(i * 99) * 380 + 400;
    const sy = Math.cos(i * 47) * 580 + 600;
    const r = (i % 3 === 0) ? 3 : 1.8;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer Gold Border
  ctx.save();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(28, 28, 744, 1144, 30);
  ctx.stroke();
  ctx.restore();

  // Inner Rose-Gold Border
  ctx.strokeStyle = '#F48FB1';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(42, 42, 716, 1116, 22);
  ctx.stroke();

  // Four Corner Stars
  ctx.fillStyle = '#FFA000';
  ctx.font = '22px Fredoka, sans-serif';
  ctx.textBaseline = 'middle';
  drawCenteredText(ctx, '✦', 60, 60);
  drawCenteredText(ctx, '✦', 740, 60);
  drawCenteredText(ctx, '✦', 60, 1140);
  drawCenteredText(ctx, '✦', 740, 1140);
  ctx.textBaseline = 'alphabetic';

  // Top Header Area
  ctx.fillStyle = '#8E24AA';
  ctx.font = 'bold 16px Fredoka, sans-serif';
  drawCenteredText(ctx, '✦ CARE BEARS BIRTHDAY TAROT ✦', 400, 90);

  // Slot Badge Banner
  ctx.fillStyle = '#E91E63';
  ctx.font = 'bold 20px Mali, sans-serif';
  drawCenteredText(ctx, `✦ ไพ่ใบที่ ${slotIndex} : ${slotTitle} ✦`, 400, 126);

  // Card Numeral
  ctx.fillStyle = '#7B1FA2';
  ctx.font = 'bold 18px Fredoka, sans-serif';
  drawCenteredText(ctx, cardData.numeral, 400, 160);

  // Card Title
  ctx.save();
  ctx.fillStyle = '#C2185B';
  ctx.font = 'bold 32px Mali, sans-serif';
  ctx.shadowColor = 'rgba(233, 30, 99, 0.15)';
  ctx.shadowBlur = 8;
  drawCenteredText(ctx, cardData.title, 400, 204);
  ctx.restore();

  // Center Care Bear Halo
  const haloX = 400;
  const haloY = 415;
  const haloR = 150;

  const haloGrad = ctx.createRadialGradient(haloX, haloY, 20, haloX, haloY, haloR);
  haloGrad.addColorStop(0, '#FFFDE7');
  haloGrad.addColorStop(0.7, '#FFE082');
  haloGrad.addColorStop(1, '#FFB300');

  ctx.save();
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(haloX, haloY, haloR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.restore();

  // Draw Care Bear Image inside halo
  const bearImg = await loadImage(cardData.img);
  if (bearImg) {
    ctx.drawImage(bearImg, haloX - 120, haloY - 120, 240, 240);
  }

  // Keyword Pill Banner
  ctx.fillStyle = '#FFF0F5';
  ctx.strokeStyle = '#FF4081';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(140, 600, 520, 48, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#880E4F';
  ctx.font = 'bold 20px Mali, sans-serif';
  drawCenteredText(ctx, `✨ ${cardData.keyword} ✨`, 400, 632);

  // Blessing Text Box
  const boxX = 65;
  const boxY = 675;
  const boxW = 670;
  const boxH = 340;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.strokeStyle = '#F48FB1';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 22);
  ctx.fill();
  ctx.stroke();

  // Inner decoration in blessing box
  ctx.fillStyle = '#C2185B';
  ctx.font = 'bold 21px Mali, sans-serif';
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText('💖 คำอวยพร & ความหมายของไพ่:', boxX + 30, boxY + 45);

  ctx.fillStyle = '#3E2723';
  ctx.font = 'bold 23px Mali, sans-serif';
  wrapCanvasText(ctx, `"${cardData.blessing}"`, boxX + 30, boxY + 95, boxW - 60, 38, false);

  // Footer
  ctx.fillStyle = '#D81B60';
  ctx.font = 'bold 20px Fredoka, Mali, sans-serif';
  drawCenteredText(ctx, "🎂 Bam-Bam's Special Day • 4 October 💖", 400, 1075);

  ctx.fillStyle = '#8E24AA';
  ctx.font = '15px Mali, sans-serif';
  drawCenteredText(ctx, '✦ Care-a-Lot Celestial Birthday Blessing • สุขสันต์วันเกิดนะ แบมๆ ✦', 400, 1110);

  // Display in iOS & iPad Friendly Modal
  showCanvasInModal(
    canvas,
    `Bam-Bam-Tarot-${slotIndex}-${cardData.id}.png`,
    `ไพ่ทาโรต์ใบที่ ${slotIndex}: ${cardData.name} 🃏💖`,
    `คำอวยพรจากไพ่ ${cardData.name}: "${cardData.blessing}" 💖`
  );
}

async function renderTarotSummaryCanvas(pickedCards) {
  if (!pickedCards || pickedCards.length < 3) return;
  await ensureFontsLoaded();

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d');
  ctx.direction = 'ltr';

  // Bright Dreamy Gradient Background
  const grad = ctx.createLinearGradient(0, 0, 1200, 850);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.35, '#FFF0F6');
  grad.addColorStop(0.7, '#FFF8E7');
  grad.addColorStop(1, '#F3E5F5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 850);

  // Gold Outer Border
  ctx.save();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(25, 25, 1150, 800, 24);
  ctx.stroke();
  ctx.restore();

  // Header
  ctx.fillStyle = '#C2185B';
  ctx.font = 'bold 24px Fredoka, sans-serif';
  drawCenteredText(ctx, '✦ CARE BEARS BIRTHDAY TAROT • บทสรุปคำพยากรณ์ประจำปี ✦', 600, 68);

  ctx.fillStyle = '#8E24AA';
  ctx.font = 'bold 18px Mali, sans-serif';
  drawCenteredText(ctx, 'สุขสันต์วันเกิดนะ แบมๆ (4 ตุลาคม) 💖🎂 • ไพ่ 3 ใบที่แบมๆ เลือกไว้', 600, 102);

  // 3 Mini Cards Side by Side
  const slotTitles = ['ความรัก & คนข้างกาย 💕', 'พลังใจ & การใช้ชีวิต ☀️', 'พรพิเศษประจำปี 🌟'];
  const cardW = 340;
  const cardH = 430;
  const startX = 65;
  const gapX = 40;
  const startY = 125;

  for (let i = 0; i < 3; i++) {
    const card = pickedCards[i];
    const cx = startX + i * (cardW + gapX);
    const cy = startY;

    // Card white panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.strokeStyle = '#F48FB1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(cx, cy, cardW, cardH, 18);
    ctx.fill();
    ctx.stroke();

    // Slot badge
    ctx.fillStyle = '#E91E63';
    ctx.beginPath();
    ctx.roundRect(cx + 20, cy + 14, cardW - 40, 28, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px Mali, sans-serif';
    drawCenteredText(ctx, `ใบที่ ${i + 1}: ${slotTitles[i]}`, cx + cardW / 2, cy + 32);

    // Card Title
    ctx.fillStyle = '#C2185B';
    ctx.font = 'bold 17px Mali, sans-serif';
    drawCenteredText(ctx, card.title, cx + cardW / 2, cy + 68);

    // Bear Image Frame
    const bearCircleX = cx + cardW / 2;
    const bearCircleY = cy + 145;
    ctx.fillStyle = '#FFF8E1';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bearCircleX, bearCircleY, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const bImg = await loadImage(card.img);
    if (bImg) {
      ctx.drawImage(bImg, bearCircleX - 48, bearCircleY - 48, 96, 96);
    }

    // Keyword Pill
    ctx.fillStyle = '#FCE4EC';
    ctx.beginPath();
    ctx.roundRect(cx + 20, cy + 218, cardW - 40, 26, 13);
    ctx.fill();

    ctx.fillStyle = '#880E4F';
    ctx.font = 'bold 12.5px Mali, sans-serif';
    drawCenteredText(ctx, card.keyword, cx + cardW / 2, cy + 235);

    // Blessing Excerpt
    ctx.fillStyle = '#3E2723';
    ctx.font = '14px Mali, sans-serif';
    wrapCanvasText(ctx, `"${card.blessing}"`, cx + 20, cy + 270, cardW - 40, 22, false);
  }

  // Bottom Grand Summary Box
  const sumBoxX = 65;
  const sumBoxY = 580;
  const sumBoxW = 1070;
  const sumBoxH = 175;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(sumBoxX, sumBoxY, sumBoxW, sumBoxH, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#C2185B';
  ctx.font = 'bold 18px Mali, sans-serif';
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText('🔮 บทสรุปคำพยากรณ์ประจำปีของแบมๆ 💖:', sumBoxX + 25, sumBoxY + 36);

  ctx.fillStyle = '#4E342E';
  ctx.font = '16px Mali, sans-serif';
  wrapCanvasText(
    ctx,
    '"ปีนี้ของแบมๆ จะเป็นปีที่เต็มไปด้วยความรัก ความสดใส และมีเค้าคอยซัพพอร์ตอยู่ข้างๆ ไม่ว่าจะเหนื่อยหรือมีเรื่องให้ขี้น้อยใจ จำไว้นะว่ามีเค้าคนนี้พร้อมโอ๋และรักแบมๆ เสมอนะคะ!"',
    sumBoxX + 25,
    sumBoxY + 70,
    sumBoxW - 50,
    26,
    false
  );

  ctx.fillStyle = '#8E24AA';
  ctx.font = 'bold 15px Mali, sans-serif';
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText('✨ ความรักมั่นคง • สุขภาพกายใจสดใส • สมหวังทุกประการ ✨', sumBoxX + 25, sumBoxY + 145);

  // Footer Keepsake
  ctx.fillStyle = '#8E24AA';
  ctx.font = 'bold 17px Fredoka, Mali, sans-serif';
  drawCenteredText(ctx, 'Bam-Bam & Khao • Birthday Keepsake 2026 💖', 600, 795);

  showCanvasInModal(
    canvas,
    'Bam-Bam-Tarot-3Cards-Summary.png',
    'บทสรุปไพ่ทาโรต์ 3 ใบของแบมๆ 🃏✨',
    'บทสรุปคำพยากรณ์ไพ่ทาโรต์ประจำปีของแบมๆ 💖'
  );
}

/* ================= SCENE 5: CARE BEARS BIRTHDAY TAROT ================= */
function initTarotScene() {
  const tarotDeckContainer = document.getElementById('tarotDeckContainer');
  const tarotDeck = document.getElementById('tarotDeck');
  const tarotShuffleBtn = document.getElementById('tarotShuffleBtn');
  const shuffleBtnText = document.getElementById('shuffleBtnText');
  const tarotPickCounter = document.getElementById('tarotPickCounter');
  const pickedCountSpan = document.getElementById('pickedCount');
  const tarotFannedDeckWrapper = document.getElementById('tarotFannedDeckWrapper');
  const tarotFannedCards = document.getElementById('tarotFannedCards');
  const tarotGrandSummary = document.getElementById('tarotGrandSummary');
  const saveTarotSummaryBtn = document.getElementById('saveTarotSummaryBtn');
  const tarotRepickBtn = document.getElementById('tarotRepickBtn');

  if (!tarotDeck || !tarotFannedCards) return;

  let isShuffling = false;
  let pickedTarotCards = [];

  function resetTarot() {
    isShuffling = false;
    pickedTarotCards = [];
    if (tarotPickCounter) tarotPickCounter.style.display = 'none';
    if (pickedCountSpan) pickedCountSpan.textContent = '0';
    if (tarotFannedDeckWrapper) tarotFannedDeckWrapper.style.display = 'none';
    if (tarotGrandSummary) tarotGrandSummary.style.display = 'none';
    if (tarotDeckContainer) tarotDeckContainer.style.display = 'flex';
    if (shuffleBtnText) shuffleBtnText.textContent = 'แตะเพื่อสับไพ่ (Shuffle Cards)';
    if (tarotShuffleBtn) tarotShuffleBtn.disabled = false;
    if (tarotDeck) tarotDeck.classList.remove('shuffling');

    // Reset 3 slots
    for (let i = 1; i <= 3; i++) {
      const slot = document.getElementById(`tarotSlot${i}`);
      if (slot) {
        slot.classList.remove('filled');
        const slotTitle = i === 1
          ? 'ความรัก & คนข้างกาย 💕'
          : (i === 2 ? 'พลังใจ & การใช้ชีวิต ☀️' : 'พรพิเศษประจำปี 🌟');
        slot.innerHTML = `
          <div class="slot-header">
            <span class="slot-badge">ใบที่ ${i}</span>
            <span class="slot-title">${slotTitle}</span>
          </div>
          <div class="tarot-card-placeholder" id="placeholder${i}">
            <span class="placeholder-icon">🃏</span>
            <span class="placeholder-text">รอเลือกใบที่ ${i}</span>
          </div>
        `;
      }
    }
  }

  // Shuffle Action
  tarotShuffleBtn.addEventListener('click', () => {
    if (isShuffling) return;
    isShuffling = true;
    audio.playCardFlip();
    tarotDeck.classList.add('shuffling');
    shuffleBtnText.textContent = 'กำลังสับไพ่อธิษฐาน... 🔮✨';
    tarotShuffleBtn.disabled = true;

    // Confetti burst
    const rect = tarotDeck.getBoundingClientRect();
    confetti.blast(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

    setTimeout(() => {
      tarotDeck.classList.remove('shuffling');
      tarotDeckContainer.style.display = 'none';
      tarotFannedDeckWrapper.style.display = 'block';
      tarotPickCounter.style.display = 'block';
      renderFannedCards();
    }, 1200);
  });

  // Render 8 fanned cards
  function renderFannedCards() {
    tarotFannedCards.innerHTML = '';
    const shuffledCards = [...tarotCards].sort(() => Math.random() - 0.5);

    shuffledCards.forEach((cardData) => {
      const fannedCard = document.createElement('div');
      fannedCard.className = 'fanned-card';
      fannedCard.setAttribute('data-id', cardData.id);
      fannedCard.innerHTML = `
        <div class="card-back-pattern">
          <span class="back-star">✨</span>
          <span class="back-bear">🐻</span>
          <span class="back-star">🌙</span>
        </div>
      `;

      fannedCard.addEventListener('click', () => {
        handleCardPick(cardData, fannedCard);
      });

      tarotFannedCards.appendChild(fannedCard);
    });
  }

  // Handle Card Pick
  function handleCardPick(cardData, fannedCardEl) {
    if (pickedTarotCards.length >= 3) return;
    if (fannedCardEl.classList.contains('picked')) return;

    pickedTarotCards.push(cardData);
    fannedCardEl.classList.add('picked');
    audio.playCardFlip();

    const count = pickedTarotCards.length;
    if (pickedCountSpan) pickedCountSpan.textContent = count;

    // Fill current slot
    const targetSlot = document.getElementById(`tarotSlot${count}`);
    if (targetSlot) {
      targetSlot.classList.add('filled');
      const slotTitle = count === 1
        ? 'ความรัก & คนข้างกาย 💕'
        : (count === 2 ? 'พลังใจ & การใช้ชีวิต ☀️' : 'พรพิเศษประจำปี 🌟');

      targetSlot.innerHTML = `
        <div class="slot-header">
          <span class="slot-badge">ใบที่ ${count}</span>
          <span class="slot-title">${slotTitle}</span>
        </div>
        <div class="tarot-revealed-card">
          <div class="tarot-card-arch-header">
            <span class="card-numeral">${cardData.numeral}</span>
            <h4 class="card-title">${cardData.title}</h4>
          </div>
          <div class="tarot-bear-frame">
            <img src="${cardData.img}" alt="${cardData.name}" class="tarot-bear-img">
          </div>
          <div class="card-keyword-pill">${cardData.keyword}</div>
          <div class="card-blessing-box">
            <span class="card-blessing-label">💖 คำอวยพร & พลังใจ:</span>
            <p class="card-blessing-text">"${cardData.blessing}"</p>
          </div>
          <button class="save-tarot-card-btn" id="saveTarotCardBtn${count}">
            <span>💾</span> เซฟรูปการ์ดใบนี้
          </button>
        </div>
      `;

      const saveBtn = targetSlot.querySelector(`#saveTarotCardBtn${count}`);
      if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          audio.playPop();
          renderTarotCardImage(cardData, count);
        });
      }

      const rect = targetSlot.getBoundingClientRect();
      confetti.blast(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    }

    if (pickedTarotCards.length === 3) {
      document.querySelectorAll('.fanned-card:not(.picked)').forEach(c => c.classList.add('disabled'));
      setTimeout(() => {
        showTarotGrandSummary();
      }, 700);
    }
  }

  function showTarotGrandSummary() {
    if (!tarotGrandSummary) return;
    tarotGrandSummary.style.display = 'block';
    audio.playFanfare();
    confetti.blast(window.innerWidth / 2, window.innerHeight * 0.45, 90);
    tarotGrandSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (saveTarotSummaryBtn) {
    saveTarotSummaryBtn.addEventListener('click', () => {
      audio.playPop();
      renderTarotSummaryCanvas(pickedTarotCards);
    });
  }

  if (tarotRepickBtn) {
    tarotRepickBtn.addEventListener('click', resetTarot);
  }

  resetTarot();
}

/* ================= THUNDER HEART CANVAS RENDERING ================= */
async function renderThunderCardImage(sym, slotIndex) {
  await ensureFontsLoaded();
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');
  ctx.direction = 'ltr';

  const slotTitle = slotIndex === 1
    ? 'ความรัก & คนข้างกาย 💕'
    : (slotIndex === 2 ? 'พลังใจ & การใช้ชีวิต ☀️' : 'โชคลาภ & พรพิเศษประจำปี 🌟');
  const forecastText = slotIndex === 1
    ? sym.forecast1
    : (slotIndex === 2 ? sym.forecast2 : sym.forecast3);

  // Amber / Golden Sunset Gradient Background
  const grad = ctx.createLinearGradient(0, 0, 800, 1200);
  grad.addColorStop(0, '#E65100');
  grad.addColorStop(0.3, '#F57C00');
  grad.addColorStop(0.7, '#FFA726');
  grad.addColorStop(1, '#FFF3E0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1200);

  // Double Border with Golden Stroke
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 235, 59, 0.8)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(28, 28, 744, 1144, 28);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(42, 42, 716, 1116, 20);
  ctx.stroke();

  // Corner Symbols (⚡ and ♎)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '24px sans-serif';
  ctx.textBaseline = 'middle';
  drawCenteredText(ctx, '⚡', 60, 60);
  drawCenteredText(ctx, '♎', 740, 60);
  drawCenteredText(ctx, '♎', 60, 1140);
  drawCenteredText(ctx, '⚡', 740, 1140);
  ctx.textBaseline = 'alphabetic';

  // Top Header Area
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Fredoka, sans-serif';
  drawCenteredText(ctx, '⚡ THUNDER HEART • LIBRA CARE BEAR ♎', 400, 90);

  ctx.fillStyle = '#FFF8E1';
  ctx.font = 'bold 20px Mali, sans-serif';
  drawCenteredText(ctx, '✦ แคร์แบร์ประจำราศีตุลย์ • วันเกิด 4 ตุลาคม ✦', 400, 126);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Mali, sans-serif';
  drawCenteredText(ctx, `คำทำนายที่ ${slotIndex} : ${slotTitle}`, 400, 165);

  // Center Halo with Big Glowing Icon
  const haloX = 400;
  const haloY = 360;
  const haloR = 120;

  const haloGrad = ctx.createRadialGradient(haloX, haloY, 20, haloX, haloY, haloR);
  haloGrad.addColorStop(0, '#FFFFFF');
  haloGrad.addColorStop(0.7, '#FFE082');
  haloGrad.addColorStop(1, '#FFB74D');

  ctx.save();
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(haloX, haloY, haloR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FF9800';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 152, 0, 0.5)';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.restore();

  // Draw Emoji / Icon in center halo
  ctx.font = '90px sans-serif';
  ctx.textBaseline = 'middle';
  drawCenteredText(ctx, sym.icon, haloX, haloY);
  ctx.textBaseline = 'alphabetic';

  // Symbol Name
  ctx.fillStyle = '#BF360C';
  ctx.font = 'bold 36px Mali, sans-serif';
  drawCenteredText(ctx, sym.name, 400, 525);

  // Aspect Badge
  ctx.fillStyle = '#FFF0F5';
  ctx.strokeStyle = '#E91E63';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(250, 550, 300, 42, 21);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#7B1FA2';
  ctx.font = 'bold 18px Mali, sans-serif';
  drawCenteredText(ctx, `⚡ ${sym.aspect}`, 400, 577);

  // Forecast Box
  const boxX = 65;
  const boxY = 620;
  const boxW = 670;
  const boxH = 210;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.strokeStyle = '#FFA000';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E65100';
  ctx.font = 'bold 22px Mali, sans-serif';
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText('✨ เรื่องดีๆ ที่จะพบในปีนี้:', boxX + 28, boxY + 44);

  ctx.fillStyle = '#3E2723';
  ctx.font = '22px Mali, sans-serif';
  wrapCanvasText(ctx, forecastText, boxX + 28, boxY + 86, boxW - 56, 36, false);

  // Thunder Heart Voice Box
  const tBoxY = 855;
  const tBoxH = 190;

  ctx.fillStyle = '#FFF8E1';
  ctx.strokeStyle = '#FF9800';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(boxX, tBoxY, boxW, tBoxH, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#BF360C';
  ctx.font = 'bold 22px Mali, sans-serif';
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText('⚡ พลังใจจาก Thunder Heart:', boxX + 28, tBoxY + 44);

  ctx.fillStyle = '#4E342E';
  ctx.font = '21px Mali, sans-serif';
  wrapCanvasText(ctx, `"${sym.thunderBlessing}"`, boxX + 28, tBoxY + 86, boxW - 56, 34, false);

  // Footer
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 19px Fredoka, Mali, sans-serif';
  drawCenteredText(ctx, '⚡ Thunder Heart Bear • พลังใจแด่แบมๆ ตลอดทั้งปี ♎💖', 400, 1105);

  showCanvasInModal(
    canvas,
    `Bam-Bam-Thunder-Heart-${sym.id}.png`,
    `คำพยากรณ์จาก Thunder Heart: ${sym.name} ⚡`,
    `คำพยากรณ์จาก Thunder Heart ถึง แบมๆ: "${forecastText}" ⚡💖`
  );
}

async function renderThunderSummaryCanvas(pickedSymbols) {
  if (!pickedSymbols || pickedSymbols.length < 3) return;
  await ensureFontsLoaded();

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d');
  ctx.direction = 'ltr';

  // Amber / Golden Celestial Gradient
  const grad = ctx.createLinearGradient(0, 0, 1200, 850);
  grad.addColorStop(0, '#E65100');
  grad.addColorStop(0.4, '#F57C00');
  grad.addColorStop(0.8, '#FFB74D');
  grad.addColorStop(1, '#FFF8E1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 850);

  // Gold Double Outer Border
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 235, 59, 0.8)';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.roundRect(25, 25, 1150, 800, 24);
  ctx.stroke();
  ctx.restore();

  // Header
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Fredoka, sans-serif';
  drawCenteredText(ctx, '⚡ THUNDER HEART • สรุปคำพยากรณ์แห่งดวงดาวประจำราศีตุลย์ ♎', 600, 68);

  ctx.fillStyle = '#FFF8E1';
  ctx.font = 'bold 18px Mali, sans-serif';
  drawCenteredText(ctx, 'ถึง แบมๆ (วันเกิด 4 ตุลาคม) • แคร์แบร์ผู้พิทักษ์แห่งความสมดุลและพลังใจ ⚡💖', 600, 102);

  // 3 Symbol Cards
  const slotTitles = ['ความรัก & คนข้างกาย 💕', 'พลังใจ & การใช้ชีวิต ☀️', 'โชคลาภ & พรพิเศษ 🌟'];
  const cardW = 340;
  const cardH = 430;
  const startX = 65;
  const gapX = 40;
  const startY = 125;

  for (let i = 0; i < 3; i++) {
    const sym = pickedSymbols[i];
    const cx = startX + i * (cardW + gapX);
    const cy = startY;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#FFA726';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(cx, cy, cardW, cardH, 18);
    ctx.fill();
    ctx.stroke();

    // Badge
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.roundRect(cx + 20, cy + 14, cardW - 40, 28, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px Mali, sans-serif';
    drawCenteredText(ctx, `สัญลักษณ์ที่ ${i + 1}: ${slotTitles[i]}`, cx + cardW / 2, cy + 32);

    // Icon Circle
    const iconCircleX = cx + cardW / 2;
    const iconCircleY = cy + 105;
    ctx.fillStyle = '#FFF3E0';
    ctx.strokeStyle = '#FFB74D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(iconCircleX, iconCircleY, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '48px sans-serif';
    ctx.textBaseline = 'middle';
    drawCenteredText(ctx, sym.icon, iconCircleX, iconCircleY);
    ctx.textBaseline = 'alphabetic';

    // Symbol Name
    ctx.fillStyle = '#E65100';
    ctx.font = 'bold 18px Mali, sans-serif';
    drawCenteredText(ctx, sym.name, cx + cardW / 2, cy + 175);

    // Aspect
    ctx.fillStyle = '#7B1FA2';
    ctx.font = 'bold 12.5px Mali, sans-serif';
    drawCenteredText(ctx, `⚡ ${sym.aspect}`, cx + cardW / 2, cy + 200);

    // Forecast text
    const fText = i === 0 ? sym.forecast1 : (i === 1 ? sym.forecast2 : sym.forecast3);
    ctx.fillStyle = '#3E2723';
    ctx.font = '13.5px Mali, sans-serif';
    wrapCanvasText(ctx, fText, cx + 18, cy + 225, cardW - 36, 21, false);

    // Thunder Blessing box
    ctx.fillStyle = '#FFF8E1';
    ctx.beginPath();
    ctx.roundRect(cx + 12, cy + 340, cardW - 24, 76, 10);
    ctx.fill();

    ctx.fillStyle = '#BF360C';
    ctx.font = 'bold 11px Mali, sans-serif';
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    ctx.fillText('⚡ พลังใจจาก Thunder Heart:', cx + 20, cy + 358);

    ctx.fillStyle = '#4E342E';
    ctx.font = '11.5px Mali, sans-serif';
    wrapCanvasText(ctx, `"${sym.thunderBlessing}"`, cx + 20, cy + 376, cardW - 40, 16, false);
  }

  // Bottom Grand Summary Box
  const sumBoxX = 65;
  const sumBoxY = 580;
  const sumBoxW = 1070;
  const sumBoxH = 175;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.strokeStyle = '#FF9800';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(sumBoxX, sumBoxY, sumBoxW, sumBoxH, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E65100';
  ctx.font = 'bold 18px Mali, sans-serif';
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText('⚡ สารพยากรณ์สรุปแห่งดวงดาวจาก Thunder Heart ถึง แบมๆ (4 ตุลาคม) ♎:', sumBoxX + 25, sumBoxY + 36);

  ctx.fillStyle = '#3E2723';
  ctx.font = '15.5px Mali, sans-serif';
  wrapCanvasText(
    ctx,
    '"ขอให้สายฟ้าแห่งความหวังและพลังดวงดาวราศีตุลย์ นำพาความสุข สมดุล และรอยยิ้มมาสู่หัวใจของแบมๆ ตลอดทั้งปี... เธอคือคนที่ยอดเยี่ยมและเปล่งประกายที่สุดเสมอ สุขสันต์วันเกิดนะ! ♎💖"',
    sumBoxX + 25,
    sumBoxY + 70,
    sumBoxW - 50,
    26,
    false
  );

  ctx.fillStyle = '#BF360C';
  ctx.font = 'bold 15px Mali, sans-serif';
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText('♎ สาวราศีตุลย์คนเก่ง • ⚡ พลังสายฟ้าชาร์จใจ • 💖 ดวงดาวคุ้มครองตลอดปี', sumBoxX + 25, sumBoxY + 145);

  // Footer Keepsake
  ctx.fillStyle = '#4E342E';
  ctx.font = 'bold 17px Fredoka, Mali, sans-serif';
  drawCenteredText(ctx, 'Thunder Heart Bear • Libra Guardian for Bam-Bam ⚡💖', 600, 795);

  showCanvasInModal(
    canvas,
    'Bam-Bam-Thunder-Heart-Summary.png',
    'สรุปคำพยากรณ์จาก Thunder Heart ⚡🔮',
    'สรุปคำพยากรณ์จาก Thunder Heart ถึง แบมๆ (4 ตุลาคม) ⚡💖'
  );
}

/* ================= SCENE 6: THUNDER HEART LIBRA ORACLE (20 SYMBOLS -> PICK 3) ================= */
function initThunderHeartScene() {
  const symbolsGrid = document.getElementById('symbolsGrid');
  const symbolsCounterPill = document.getElementById('symbolsCounterPill');
  const thunderGrandSummary = document.getElementById('thunderGrandSummary');
  const thunderSummaryMessage = document.getElementById('thunderSummaryMessage');
  const saveThunderSummaryBtn = document.getElementById('saveThunderSummaryBtn');
  const thunderRepickBtn = document.getElementById('thunderRepickBtn');

  if (!symbolsGrid) return;

  let pickedSymbols = [];

  function renderSymbolsGrid() {
    symbolsGrid.innerHTML = '';
    thunderSymbols.forEach(sym => {
      const card = document.createElement('div');
      card.className = 'symbol-card-item';
      card.setAttribute('data-id', sym.id);
      card.innerHTML = `
        <span class="symbol-item-icon">${sym.icon}</span>
        <span class="symbol-item-name">${sym.name}</span>
        <span class="symbol-item-tag">${sym.tag}</span>
      `;

      card.addEventListener('click', () => {
        handleSymbolSelection(sym, card);
      });

      symbolsGrid.appendChild(card);
    });
  }

  function handleSymbolSelection(sym, cardEl) {
    if (pickedSymbols.length >= 3) return;
    if (cardEl.classList.contains('selected')) return;

    pickedSymbols.push(sym);
    cardEl.classList.add('selected');
    audio.playPop();

    const countSpan = document.getElementById('pickedSymbolsCount');
    if (countSpan) countSpan.textContent = pickedSymbols.length;

    const slotIndex = pickedSymbols.length;
    const targetSlot = document.getElementById(`thunderSlot${slotIndex}`);
    if (targetSlot) {
      targetSlot.classList.add('filled');
      const slotTitle = slotIndex === 1
        ? 'ความรัก & คนข้างกาย 💕'
        : (slotIndex === 2 ? 'พลังใจ & การใช้ชีวิต ☀️' : 'โชคลาภ & พรพิเศษประจำปี 🌟');
      const forecastText = slotIndex === 1
        ? sym.forecast1
        : (slotIndex === 2 ? sym.forecast2 : sym.forecast3);

      targetSlot.innerHTML = `
        <div class="slot-header">
          <span class="slot-badge thunder-badge-slot">สัญลักษณ์ที่ ${slotIndex}</span>
          <span class="slot-title">${slotTitle}</span>
        </div>
        <div class="oracle-revealed-card">
          <div class="oracle-icon-halo">${sym.icon}</div>
          <h4 class="oracle-card-title">${sym.name}</h4>
          <span class="oracle-aspect-badge">⚡ ${sym.aspect}</span>
          <div class="oracle-forecast-box">
            <span class="oracle-forecast-label">✨ เรื่องดีๆ ที่จะพบในปีนี้:</span>
            <p class="oracle-forecast-text">${forecastText}</p>
          </div>
          <div class="oracle-thunder-box">
            <span class="oracle-thunder-label">⚡ พลังใจจาก Thunder Heart:</span>
            <p class="oracle-thunder-text">"${sym.thunderBlessing}"</p>
          </div>
        </div>
        <button class="save-tarot-card-btn save-thunder-card-btn" id="saveThunderSlotBtn${slotIndex}" style="border-color: #FFA726; color: #E65100; margin-top: 8px;">
          <span>💾</span> เซฟรูปคำพยากรณ์นี้
        </button>
      `;

      const slotSaveBtn = targetSlot.querySelector(`#saveThunderSlotBtn${slotIndex}`);
      if (slotSaveBtn) {
        slotSaveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          audio.playPop();
          renderThunderCardImage(sym, slotIndex);
        });
      }

      audio.playCardFlip();
      const rect = targetSlot.getBoundingClientRect();
      confetti.blast(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    }

    if (pickedSymbols.length === 3) {
      document.querySelectorAll('.symbol-card-item:not(.selected)').forEach(el => el.classList.add('disabled'));

      if (symbolsCounterPill) {
        symbolsCounterPill.classList.add('ready');
        symbolsCounterPill.innerHTML = '🎉 เลือกครบ 3 สัญลักษณ์แล้ว! ดูคำพยากรณ์จาก Thunder Heart ด้านล่างได้เลย ⚡🔮';
      }

      setTimeout(() => {
        showGrandSummary();
      }, 750);
    }
  }

  function showGrandSummary() {
    if (!thunderGrandSummary || !thunderSummaryMessage || pickedSymbols.length < 3) return;

    const s1 = pickedSymbols[0];
    const s2 = pickedSymbols[1];
    const s3 = pickedSymbols[2];

    thunderSummaryMessage.innerHTML = `
      <p style="margin-bottom: 12px; font-weight: 700; color: #E65100;">
        ⚡ คำทำนาย & พลังใจจาก Thunder Heart แคร์แบร์ประจำราศีตุลย์ ถึง แบมๆ (4 ตุลาคม) ♎:
      </p>
      <div style="text-align: left; background: rgba(255,255,255,0.92); border-radius: 14px; padding: 14px 16px; margin-bottom: 14px; border: 1.5px solid #FFE082; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        <p style="margin-bottom: 10px; font-size: 14px; line-height: 1.6;">
          💕 <strong>ความรัก & คนข้างกาย (${s1.icon} ${s1.name}):</strong><br>
          ${s1.forecast1}
        </p>
        <p style="margin-bottom: 10px; font-size: 14px; line-height: 1.6;">
          ☀️ <strong>พลังใจ & การใช้ชีวิต (${s2.icon} ${s2.name}):</strong><br>
          ${s2.forecast2}
        </p>
        <p style="margin-bottom: 0; font-size: 14px; line-height: 1.6;">
          🌟 <strong>โชคลาภ & พรพิเศษประจำปี (${s3.icon} ${s3.name}):</strong><br>
          ${s3.forecast3}
        </p>
      </div>
      <div style="font-weight: 700; color: #BF360C; background: #FFF3E0; padding: 14px 16px; border-radius: 12px; border-left: 4px solid #FF9800; text-align: left; line-height: 1.6;">
        ⚡ <strong>สารส่งท้ายจาก Thunder Heart:</strong> "ขอให้สายฟ้าแห่งความหวังและพลังดวงดาวราศีตุลย์ นำพาความสุข สมดุล และรอยยิ้มมาสู่หัวใจของแบมๆ ตลอดทั้งปี... เธอคือคนที่ยอดเยี่ยมและเปล่งประกายที่สุดเสมอ สุขสันต์วันเกิดนะ! ♎💖"
      </div>
    `;

    thunderGrandSummary.style.display = 'block';
    audio.playFanfare();
    confetti.blast(window.innerWidth / 2, window.innerHeight * 0.45, 90);
    thunderGrandSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (saveThunderSummaryBtn) {
    saveThunderSummaryBtn.addEventListener('click', () => {
      audio.playPop();
      renderThunderSummaryCanvas(pickedSymbols);
    });
  }

  function resetThunderHeart() {
    pickedSymbols = [];

    if (symbolsCounterPill) {
      symbolsCounterPill.classList.remove('ready');
      symbolsCounterPill.innerHTML = '✨ แตะเลือกสัญลักษณ์ที่ถูกใจ (<span id="pickedSymbolsCount">0</span> / 3 สัญลักษณ์)';
    }

    if (thunderGrandSummary) {
      thunderGrandSummary.style.display = 'none';
    }

    document.querySelectorAll('.symbol-card-item').forEach(card => {
      card.classList.remove('selected', 'disabled');
    });

    for (let i = 1; i <= 3; i++) {
      const slot = document.getElementById(`thunderSlot${i}`);
      if (slot) {
        slot.classList.remove('filled');
        const slotTitle = i === 1
          ? 'ความรัก & คนข้างกาย 💕'
          : (i === 2 ? 'พลังใจ & การใช้ชีวิต ☀️' : 'โชคลาภ & พรพิเศษประจำปี 🌟');
        slot.innerHTML = `
          <div class="slot-header">
            <span class="slot-badge thunder-badge-slot">สัญลักษณ์ที่ ${i}</span>
            <span class="slot-title">${slotTitle}</span>
          </div>
          <div class="tarot-card-placeholder" id="thunderPlaceholder${i}">
            <span class="placeholder-icon">⚡</span>
            <span class="placeholder-text">รอเลือกสัญลักษณ์ที่ ${i}</span>
          </div>
        `;
      }
    }

    audio.playPop();
  }

  if (thunderRepickBtn) {
    thunderRepickBtn.addEventListener('click', resetThunderHeart);
  }

  renderSymbolsGrid();
  resetThunderHeart();
}

/* ================= SCENE 6: LOVE LETTER & BIG HUG ================= */
function initLetterScene() {
  const envelope = document.getElementById('envelope');
  const envelopeSeal = document.getElementById('envelopeSeal');
  const letterSheet = document.getElementById('letterSheet');
  const hugBtn = document.getElementById('hugBtn');
  const replayBtn = document.getElementById('replayBtn');

  let isOpen = false;

  function toggleLetter() {
    isOpen = !isOpen;
    audio.playPop();
    if (isOpen) {
      envelopeSeal.textContent = '❤️ จดหมายเปิดแล้ว';
      letterSheet.style.display = 'block';
      confetti.blast(window.innerWidth / 2, window.innerHeight * 0.4, 60);
    }
  }

  envelope.addEventListener('click', toggleLetter);

  // Big Hug Heart Explosion
  hugBtn.addEventListener('click', () => {
    audio.playFanfare();
    confetti.blast(window.innerWidth / 2, window.innerHeight * 0.5, 120);

    // Floating heart emojis across the screen
    const emojis = ['💖', '🫂', '🐻', '💕', '✨', '🌸', '💌'];
    for (let i = 0; i < 24; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = `${Math.random() * 90 + 5}vw`;
      heart.style.top = `${Math.random() * 40 + 50}vh`;
      heart.style.fontSize = `${Math.random() * 28 + 24}px`;
      heart.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}px`);
      heart.style.setProperty('--tr', `${(Math.random() - 0.5) * 60}deg`);
      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 2500);
    }
  });

  replayBtn.addEventListener('click', () => {
    switchScene(1);
  });
}

/* ================= TOUCH SWIPE GESTURES FOR IPHONE & IPAD ================= */
function initSwipeGestures() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 60; // Pixels required for swipe

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Ignore if vertical scrolling is dominant
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5) return;

    // Don't trigger scene swipe while user is using the camera
    if (appState.currentScene === 3 && appState.herStream) return;

    if (deltaX < -minSwipeDistance && appState.currentScene < appState.totalScenes) {
      // Swipe Left -> Next Scene
      switchScene(appState.currentScene + 1);
    } else if (deltaX > minSwipeDistance && appState.currentScene > 1) {
      // Swipe Right -> Prev Scene
      switchScene(appState.currentScene - 1);
    }
  }
}

/* ================= TOP CONTROLS & EVENT BINDINGS ================= */
function toggleBGM() {
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');

  if (appState.isAudioPlaying) {
    audio.stopBGM();
    appState.isAudioPlaying = false;
    soundBtn.classList.remove('playing');
    soundIcon.textContent = '🔇';
  } else {
    audio.startBGM();
    appState.isAudioPlaying = true;
    soundBtn.classList.add('playing');
    soundIcon.textContent = '🎵';
  }
}

function initEventBindings() {
  // Stepper dots click
  const dots = document.querySelectorAll('.step-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      switchScene(step);
    });
  });

  // Next / Prev Scene buttons
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-go'), 10);
      switchScene(target);
    });
  });

  // Sound Button
  const soundBtn = document.getElementById('soundToggleBtn');
  soundBtn.addEventListener('click', toggleBGM);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && appState.currentScene < appState.totalScenes) {
      switchScene(appState.currentScene + 1);
    } else if (e.key === 'ArrowLeft' && appState.currentScene > 1) {
      switchScene(appState.currentScene - 1);
    }
  });

  // Interactive Care Bears click squish
  const interactiveBears = document.querySelectorAll('.swinging-bear, .bounce-bear, .hero-bear, .cheer-bear');
  interactiveBears.forEach(bear => {
    bear.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playPop();
      bear.style.transform = 'scale(1.25) rotate(10deg)';
      setTimeout(() => {
        bear.style.transform = '';
      }, 300);
      const rect = bear.getBoundingClientRect();
      confetti.blast(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    });
  });
}

/* ================= DOM READY INITIALIZATION ================= */
document.addEventListener('DOMContentLoaded', () => {
  confetti = new ConfettiEngine();
  initBackgroundAtmosphere();
  initGiftBox();
  initDuoEnvelopeAndPolaroid();
  initCakeScene();
  initTarotScene();
  initThunderHeartScene();
  initLetterScene();
  initSwipeGestures();
  initEventBindings();

  // iOS Safari touch unlock for Web Audio
  const unlockAudioOnTouch = () => {
    audio.init();
    window.removeEventListener('touchstart', unlockAudioOnTouch);
    window.removeEventListener('click', unlockAudioOnTouch);
  };
  window.addEventListener('touchstart', unlockAudioOnTouch, { passive: true });
  window.addEventListener('click', unlockAudioOnTouch, { once: true });
});

