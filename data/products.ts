// data/products.ts

export const categories = [
  { id: 'all', name: 'Tất cả dịch vụ' },
  { id: 'chu-noi', name: 'Chữ Nổi & Logo' },
  { id: 'bang-hieu', name: 'Bảng Hiệu Nền' },
  { id: 'den-led', name: 'Hộp Đèn & LED' },
];

export const products = [
  {
    id: '1',
    categoryId: 'chu-noi',
    categoryName: 'Chữ Nổi & Logo',
    name: 'Bảng hiệu Alu',
    price: 'Liên hệ',
    image: 'https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739414/alu1_kndilh.jpg',
    desc: 'Tên sản phẩm: Bảng hiệu Aluminum (Alu) ngoài trời.\n\nĐặc tính kỹ thuật: Bề mặt sử dụng tấm hợp kim nhôm nhựa Alu dày 3mm - 4mm (thương hiệu Alcorest hoặc Triều Chen). Khung xương sử dụng sắt hộp mạ kẽm 20x20mm hoặc 25x25mm (Hòa Phát) gia cố chịu lực chắc chắn.\n\nƯu điểm vượt trội: Khả năng chống cháy, cách nhiệt và chịu được nắng mưa khắc nghiệt vùng biển Đà Nẵng. Bề mặt phẳng mịn, sang trọng, là lớp nền lý tưởng để gắn các loại chữ nổi nghệ thuật.',
  },
  {
    id: '2',
    categoryId: 'chu-noi',
    categoryName: 'Chữ Nổi & Logo',
    name: 'Chữ nổi Mica',
    price: 'Liên hệ',
    image: 'https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739419/mica_tablyo.jpg',
    desc: 'Tên sản phẩm: Chữ nổi Mica uốn nổi 3D.\n\nĐặc tính kỹ thuật: Sử dụng tấm Acrylic (Mica Đài Loan - thương hiệu Chochen hoặc FS) dày 2mm - 5mm. Chân chữ uốn nổi bằng Formex hoặc Mica theo tỷ lệ 1/10. Bên trong tích hợp hệ thống LED Module Samsung chống nước hắt sáng mặt.\n\nƯu điểm vượt trội: Độ bóng gương cao, xuyên sáng cực tốt (lên đến 98%). Màu sắc đa dạng với hơn 30 tông màu khác nhau, đảm bảo độ bền màu trên 5 năm, giúp thương hiệu luôn rực rỡ và chuyên nghiệp.',
  },
  {
    id: '3',
    categoryId: 'den-led',
    categoryName: 'Hộp Đèn & LED',
    name: 'Hộp đèn LED',
    price: 'Liên hệ',
    image: 'https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739418/hop-den_jx22ya.jpg',
    desc: 'Tên sản phẩm: Hộp đèn quảng cáo LED vẫy/siêu mỏng.\n\nĐặc tính kỹ thuật: Khung nhôm định hình chuyên dụng hoặc sắt hộp mạ kẽm. Mặt biển sử dụng bạt 3M in UV cao cấp hoặc Mica dẫn sáng. Hệ thống LED module 3 bóng có thấu kính khuếch tán ánh sáng đều, không bị đốm đen.\n\nƯu điểm vượt trội: Khả năng thu hút khách hàng cực cao vào ban đêm. Tiết kiệm điện năng lên đến 70% so với đèn tuýp truyền thống. Dễ dàng thay đổi nội dung hình ảnh khi cần thiết.',
  },
  {
    id: '4',
    categoryId: 'bang-hieu',
    categoryName: 'Bảng Hiệu Nền',
    name: 'Bảng hiệu bạt Hiflex',
    price: 'Liên hệ',
    image: 'https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739416/hiflex_d3yybe.jpg',
    desc: 'Tên sản phẩm: Bảng hiệu bạt Hiflex khung sắt mạ kẽm.\n\nĐặc tính kỹ thuật: Sử dụng bạt Hiflex 3.2zem - 3.6zem (bạt 2 da đế xám chống xuyên sáng). In kỹ thuật số độ phân giải 720dpi sắc nét. Khung sắt vuông 20mm mạ kẽm, có nẹp viền nhôm V chống rỉ sét.\n\nƯu điểm vượt trội: Chi phí thi công rẻ nhất, thời gian lắp đặt siêu tốc (trong ngày). Phù hợp cho các cửa hàng tạp hóa, quán ăn bình dân hoặc các chương trình quảng cáo ngắn hạn cần tiết kiệm ngân sách.',
  },
  {
    id: '5',
    categoryId: 'chu-noi',
    categoryName: 'Chữ Nổi & Logo',
    name: 'Chữ Inox',
    price: 'Liên hệ',
    image: 'https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739418/inox_mfscae.jpg',
    desc: 'Tên sản phẩm: Chữ Inox 304 gia công laser.\n\nĐặc tính kỹ thuật: Sử dụng thép không gỉ Inox 304 độ dày 0.8mm - 1.2mm (Vàng gương, Bạc xước hoặc Trắng bóng). Cắt bằng máy Laser Fiber độ chính xác tuyệt đối. Uốn nổi chân bằng máy tự động.\n\nƯu điểm vượt trội: Mang lại vẻ đẹp đẳng cấp, quyền uy bậc nhất cho doanh nghiệp. Inox 304 cam kết không bao giờ rỉ sét, thách thức mọi điều kiện thời tiết khắc nghiệt nhất, bảo hành độ bền vĩnh cửu.',
  },
  {
    id: '6',
    categoryId: 'den-led',
    categoryName: 'Hộp Đèn & LED',
    name: 'Bảng LED ma trận',
    price: 'Liên hệ',
    image: 'https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739419/ledmatran_aubrem.jpg',
    desc: 'Tên sản phẩm: Bảng điện tử LED ma trận (P10/P5).\n\nĐặc tính kỹ thuật: Các module LED P10 (Outdoor/Indoor) lắp ghép đồng bộ. Sử dụng Card điều khiển kết nối Wifi/USB. Nguồn 5V-40A chuyên dụng. Khung nhôm định hình chống nước.\n\nƯu điểm vượt trội: Cho phép khách hàng tự do thay đổi nội dung, hiệu ứng chạy chữ, ngày giờ thông qua điện thoại. Cường độ sáng cực mạnh, thu hút sự chú ý của người đi đường từ khoảng cách 100m.',
  },
  {
    id: '7',
    categoryId: 'chu-noi',
    categoryName: 'Chữ Nổi & Logo',
    name: 'Biển quảng cáo tôn sóng',
    price: 'Liên hệ',
    image: 'https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739414/alu3_gvshd2.jpg',
    desc: 'Tên sản phẩm: Biển quảng cáo nền tôn sóng sơn tĩnh điện.\n\nĐặc tính kỹ thuật: Nền sử dụng tôn sóng vuông hoặc sóng tròn (thương hiệu Hoa Sen hoặc Đông Á) dày 0.4mm. Sơn tĩnh điện màu sắc theo yêu cầu của khách hàng. Kết hợp chữ nổi Mica hoặc Inox hắt LED sáng chân.\n\nƯu điểm vượt trội: Phong cách Industrial (công nghiệp) cực kỳ cá tính và bền bỉ. Đây là xu hướng thiết kế mới nhất cho các quán Cafe, Studio và Shop quần áo thời trang tại Đà Nẵng.',
  },
  {
    id: '8',
    categoryId: 'bang-hieu',
    categoryName: 'Bảng Hiệu Nền',
    name: 'Bảng hiệu nền chữ nổi',
    price: 'Liên hệ',
    image: 'https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739416/hiflex1_vc3wzx.jpg',
    desc: 'Tên sản phẩm: Bảng hiệu nền phẳng tích hợp chữ nổi 3D.\n\nĐặc tính kỹ thuật: Nền sử dụng tấm bạt Hiflex đế xám in UV hoặc Alu 3mm Alcorest. Hệ thống chữ nổi được cắt từ vật liệu Formex sơn màu hoặc Mica uốn nổi hắt sáng.\n\nƯu điểm vượt trội: Giải pháp tối ưu giữa tính thẩm mỹ cao và ngân sách vừa phải. Nền phẳng giúp nội dung chữ nổi trở nên sống động, có chiều sâu và tạo ấn tượng mạnh mẽ với khách hàng đi đường.',
  },
];

export const projects = [
  {
    id: 1,
    title: "Bảng hiệu Alu Monarchy Đà Nẵng",
    type: "Alu",
    description: "Công trình bảng hiệu Alu quy mô lớn tại khu phức hợp Monarchy. Sử dụng tấm nhôm nhựa phức hợp độ bền cao, kết hợp hệ khung sắt gia cố chịu lực, đảm bảo tính thẩm mỹ hiện đại và bền bỉ trước gió biển Đà Nẵng.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739414/alu_fuwcew.jpg"
  },
  {
    id: 2,
    title: "Mặt dựng Alu Khách sạn Cao cấp",
    type: "Alu",
    description: "Thi công ốp mặt dựng Alu trọn gói cho khách sạn, tạo diện mạo sang trọng và sạch sẽ. Giải pháp giúp cách nhiệt tốt cho tòa nhà và dễ dàng vệ sinh, duy trì vẻ ngoài như mới trong nhiều năm.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739414/alu1_kndilh.jpg"
  },
  {
    id: 3,
    title: "Bảng hiệu Chan Closet Đà Nẵng",
    type: "Alu",
    description: "Thiết kế bảng hiệu shop thời trang với phong cách tối giản nhưng tinh tế. Nền Alu màu đặc hiệu giúp làm nổi bật logo và tên thương hiệu, thu hút ánh nhìn của khách hàng trẻ tuổi.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739414/alu2_nkbwwi.jpg "
  },
  {
    id: 4,
    title: "Biển hiệu OYO Suri Apartment",
    type: "Alu",
    description: "Dự án nhận diện thương hiệu cho căn hộ dịch vụ OYO. Thi công bảng hiệu Alu màu đỏ đặc trưng, đảm bảo đúng quy chuẩn nhận diện thương hiệu toàn cầu với độ hoàn thiện sắc nét.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739414/alu3_gvshd2.jpg"
  },
  {
    id: 5,
    title: "Bảng hiệu Phòng khám Trị liệu Cột sống",
    type: "Alu",
    description: "Không gian y tế đòi hỏi sự chuyên nghiệp và tin cậy. Bảng hiệu Alu kết hợp chữ nổi Mica trắng tạo cảm giác sạch sẽ, an tâm cho bệnh nhân ngay từ cái nhìn đầu tiên.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739416/alu4_ghhs1f.jpg"
  },
  {
    id: 6,
    title: "Bảng hiệu Cafe The Garden",
    type: "Alu",
    description: "Sự kết hợp hoàn hảo giữa vật liệu Alu giả gỗ và chữ nổi sáng đèn, tạo nên không gian ấm cúng, gần gũi với thiên nhiên cho quán cafe sân vườn.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739416/alu5_hkjtve.jpg"
  },
  {
    id: 7,
    title: "Nhận diện OYO Le House Đà Nẵng",
    type: "Alu",
    description: "Thi công bảng hiệu mặt tiền cho cơ sở lưu trú, tối ưu hóa khả năng hiển thị vào ban đêm để khách hàng dễ dàng tìm kiếm địa điểm.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739415/alu6_jwbo6m.jpg"
  },
  {
    id: 8,
    title: "Bảng hiệu Tammy Đà Nẵng",
    type: "Alu",
    description: "Bảng hiệu thời trang nữ với tông màu pastel ngọt ngào trên nền Alu cao cấp, tạo điểm nhấn nghệ thuật cho mặt phố.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739415/alu7_ze1u5w.jpg"
  },
  {
    id: 9,
    title: "Bạt Hiflex Khu vui chơi trẻ em",
    type: "Hiflex",
    description: "Sử dụng công nghệ in kỹ thuật số khổ lớn trên bạt Hiflex dày, màu sắc rực rỡ, vui nhộn, kích thích sự tò mò của các bé.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739416/hiflex_d3yybe.jpg"
  },
  {
    id: 10,
    title: "Pano Quảng cáo DOJI Đà Nẵng",
    type: "Hiflex",
    description: "Thi công thay bạt pano khổ lớn cho tập đoàn DOJI. Chất liệu Hiflex xuyên sáng giúp hình ảnh trang sức hiển thị lung linh, đẳng cấp vào ban đêm.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739416/hiflex1_vc3wzx.jpg"
  },
  {
    id: 11,
    title: "Bảng hiệu Công ty Gia Bảo",
    type: "Hiflex",
    description: "Giải pháp bảng hiệu bạt Hiflex khung sắt mạ kẽm cho kho xưởng và công ty sản xuất, tối ưu chi phí nhưng vẫn đảm bảo đầy đủ thông tin doanh nghiệp.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739417/hiflex2_pj0mjw.jpg"
  },
  {
    id: 12,
    title: "Hộp đèn EXIMBANK Nam Đà Nẵng",
    type: "Hộp Đèn",
    description: "Hệ thống hộp đèn biển hiệu ngân hàng theo đúng tiêu chuẩn thiết kế Eximbank. Ánh sáng đều, không bị đốm đen, giúp thương hiệu nổi bật 24/7.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739418/hop-den_jx22ya.jpg"
  },
  {
    id: 13,
    title: "Chữ Inox Golden Square",
    type: "Inox",
    description: "Gia công chữ Inox 304 mạ vàng gương cao cấp cho dự án bất động sản. Độ bền vĩnh cửu, không gỉ sét, mang lại vẻ đẹp quyền quý cho công trình.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739418/inox_mfscae.jpg"
  },
  {
    id: 14,
    title: "LED ma trận OYO Centre Apartment",
    type: "LED",
    description: "Bảng LED chạy chữ thay đổi nội dung linh hoạt, giúp căn hộ cập nhật các thông tin khuyến mãi hoặc giá phòng liên tục đến khách đi đường.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739419/ledmatran_aubrem.jpg"
  },
  {
    id: 15,
    title: "Trung tâm Dongtam (Mica)",
    type: "Mica",
    description: "Thi công bộ chữ nổi Mica kích thước lớn trên nền đá, tạo sự đồng bộ và chuyên nghiệp cho showroom giới thiệu sản phẩm.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739419/mica_tablyo.jpg"
  },
  {
    id: 16,
    title: "Paradise International Gaming Club",
    type: "Mica",
    description: "Hệ thống chữ nổi Mica đèn LED đa sắc, tạo hiệu ứng ánh sáng sôi động, đẳng cấp cho khu vui chơi giải trí quốc tế.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739420/mica1_f2kqcu.jpg"
  },
  {
    id: 17,
    title: "Showroom Elambo Đà Nẵng",
    type: "Mica",
    description: "Thiết kế chữ nổi Mica thanh lịch, nhẹ nhàng phù hợp với thương hiệu chăn ga gối đệm dành cho gia đình trẻ.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739420/mica2_asirqn.jpg"
  },
  {
    id: 18,
    title: "Nha khoa Paris (Mica)",
    type: "Mica",
    description: "Bộ chữ nổi Mica nhận diện thương hiệu nha khoa chuyên nghiệp. Màu xanh đặc trưng của Mica được gia công tỉ mỉ, tạo độ bóng gương sang trọng.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739421/mica3_atw7hw.jpg"
  },
  {
    id: 19,
    title: "Bảng hiệu Oasis Hotel",
    type: "Mica",
    description: "Thi công bảng hiệu khách sạn kết hợp giữa nền đá và chữ nổi Mica xuyên sáng, tạo cảm giác thư giãn như một ốc đảo ngay giữa lòng thành phố.",
    image: "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739422/mica4_h0btkl.jpg"
  }
];