import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with production data...')

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jerash.com' },
    update: {},
    create: {
      email: 'admin@jerash.com',
      passwordHash,
      name: 'Admin',
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create site settings
  const settings = [
    // Stats
    { key: 'stats.yearsExperience', value: '15', type: 'NUMBER' as const, groupName: 'stats', description: 'Years of experience' },
    { key: 'stats.projectsCompleted', value: '500', type: 'NUMBER' as const, groupName: 'stats', description: 'Projects completed' },
    { key: 'stats.employees', value: '200', type: 'NUMBER' as const, groupName: 'stats', description: 'Number of employees' },
    // Social
    { key: 'social.linkedin', value: '', type: 'STRING' as const, groupName: 'social', description: 'LinkedIn URL' },
    { key: 'social.poBox', value: '28211', type: 'STRING' as const, groupName: 'social', description: 'PO Box number' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Created site settings')

  // Create hero slides
  const heroSlides = [
    {
      imageUrl: '/uploads/hero/hero-slide-01.jpg',
      titleEn: 'Jerash For Oil Field Services',
      titleAr: 'جرش لخدمات حقول النفط',
      subtitleEn: 'Excellence in oil field solutions with an unwavering commitment to safety',
      subtitleAr: 'التميز في حلول حقول النفط مع التزام راسخ بالسلامة',
      order: 0,
      isActive: true,
    },
    {
      imageUrl: '/uploads/hero/hero-slide-02.jpg',
      titleEn: 'Jerash For Oil Field Services',
      titleAr: 'جرش لخدمات حقول النفط',
      subtitleEn: 'Excellence in oil field solutions with an unwavering commitment to safety',
      subtitleAr: 'التميز في حلول حقول النفط مع التزام راسخ بالسلامة',
      order: 1,
      isActive: true,
    },
    {
      imageUrl: '/uploads/hero/hero-slide-03.jpg',
      titleEn: 'Jerash For Oil Field Services',
      titleAr: 'جرش لخدمات حقول النفط',
      subtitleEn: 'Excellence in oil field solutions with an unwavering commitment to safety',
      subtitleAr: 'التميز في حلول حقول النفط مع التزام راسخ بالسلامة',
      order: 2,
      isActive: true,
    },
    {
      imageUrl: '/uploads/hero/hero-slide-04.jpg',
      titleEn: 'Jerash For Oil Field Services',
      titleAr: 'جرش لخدمات حقول النفط',
      subtitleEn: 'Excellence in oil field solutions with an unwavering commitment to safety',
      subtitleAr: 'التميز في حلول حقول النفط مع التزام راسخ بالسلامة',
      order: 3,
      isActive: true,
    },
  ]

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: `hero-slide-${slide.order}` },
      update: slide,
      create: { id: `hero-slide-${slide.order}`, ...slide },
    })
  }
  console.log('✅ Created hero slides')

  // Create service categories
  const categories = [
    { slug: 'production', nameEn: 'Production', nameAr: 'الإنتاج', order: 0 },
    { slug: 'wireline', nameEn: 'Wireline', nameAr: 'خدمات السلك', order: 1 },
    { slug: 'consultancy', nameEn: 'Consultancy', nameAr: 'الاستشارات', order: 2 },
    { slug: 'other', nameEn: 'Other', nameAr: 'أخرى', order: 3 },
  ]

  const categoryMap: Record<string, string> = {}
  for (const category of categories) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    categoryMap[category.slug] = created.id
  }
  console.log('✅ Created service categories')

  // Create services (26 total)
  const services = [
    // Production Services (8)
    {
      slug: 'coiled-tubing',
      categorySlug: 'production',
      icon: 'Cog',
      titleEn: 'Coiled Tubing',
      titleAr: 'الأنابيب الملفوفة (Coiled Tubing)',
      shortDescriptionEn: 'Advanced coiled tubing services for well intervention, cleanouts, and stimulation operations with state-of-the-art equipment.',
      shortDescriptionAr: 'خدمات الأنابيب الملفوفة المتقدمة للتدخل في الآبار وعمليات التنظيف والتحفيز بأحدث المعدات.',
      descriptionEn: 'Our coiled tubing services provide efficient well intervention solutions including wellbore cleanouts, nitrogen lifting, acidizing, and mechanical isolation. We operate modern coiled tubing units capable of handling complex downhole operations while maintaining the highest safety standards. Our experienced crews deliver reliable performance across a wide range of well conditions and depths.',
      descriptionAr: 'تقدم خدمات الأنابيب الملفوفة لدينا حلول تدخل فعالة في الآبار تشمل تنظيف حفرة البئر، الرفع بالنيتروجين، المعالجة الحمضية، والعزل الميكانيكي. نقوم بتشغيل وحدات أنابيب ملفوفة حديثة قادرة على التعامل مع العمليات المعقدة تحت السطح مع الحفاظ على أعلى معايير السلامة. توفر أطقمنا ذات الخبرة أداءً موثوقًا عبر مجموعة واسعة من ظروف الآبار والأعماق.',
      order: 0,
      isActive: true,
    },
    {
      slug: 'drilling-fluid',
      categorySlug: 'production',
      icon: 'Droplet',
      titleEn: 'Drilling Fluid',
      titleAr: 'سوائل الحفر',
      shortDescriptionEn: 'Complete drilling fluid solutions including mud engineering, testing, and treatment services.',
      shortDescriptionAr: 'حلول سوائل الحفر الكاملة بما في ذلك هندسة الطين والاختبار وخدمات المعالجة.',
      descriptionEn: 'We provide comprehensive drilling fluid services designed to optimize drilling performance and wellbore stability. Our mud engineers develop customized fluid systems for various formation challenges, ensuring efficient hole cleaning, formation protection, and environmental compliance. We offer both water-based and oil-based mud systems along with complete laboratory testing and real-time monitoring.',
      descriptionAr: 'نقدم خدمات سوائل الحفر الشاملة المصممة لتحسين أداء الحفر واستقرار حفرة البئر. يقوم مهندسو الطين لدينا بتطوير أنظمة سوائل مخصصة لمختلف تحديات التكوينات، مما يضمن تنظيف الحفرة بكفاءة وحماية التكوين والامتثال البيئي. نقدم أنظمة طين ذات أساس مائي وزيتي إلى جانب اختبارات مخبرية كاملة ومراقبة في الوقت الفعلي.',
      order: 1,
      isActive: true,
    },
    {
      slug: 'cementing',
      categorySlug: 'production',
      icon: 'Layers',
      titleEn: 'Cementing',
      titleAr: 'خدمات الأسمنت',
      shortDescriptionEn: 'Professional cementing services for primary and remedial well cementing operations.',
      shortDescriptionAr: 'خدمات الأسمنت المهنية لعمليات تأسيس الآبار الأولية والعلاجية.',
      descriptionEn: 'Our cementing services cover all aspects of well cementing from primary casing cementation to complex remedial squeeze jobs. We utilize advanced cement formulations and placement techniques to ensure zonal isolation and casing integrity. Our team includes experienced cement engineers who design fit-for-purpose cement programs considering well conditions, temperatures, and pressures.',
      descriptionAr: 'تغطي خدمات الأسمنت لدينا جميع جوانب تأسيس الآبار من تأسيس الغلاف الأولي إلى أعمال الضغط العلاجية المعقدة. نستخدم تركيبات أسمنتية متقدمة وتقنيات وضع لضمان العزل المنطقي وسلامة الغلاف. يضم فريقنا مهندسي أسمنت ذوي خبرة يصممون برامج أسمنتية مناسبة للغرض مع مراعاة ظروف البئر ودرجات الحرارة والضغوط.',
      order: 2,
      isActive: true,
    },
    {
      slug: 'nitrogen',
      categorySlug: 'production',
      icon: 'FlaskConical',
      titleEn: 'Nitrogen Services',
      titleAr: 'خدمات النيتروجين',
      shortDescriptionEn: 'High-pressure nitrogen pumping services for well unloading, pipeline purging, and pressure testing.',
      shortDescriptionAr: 'خدمات ضخ النيتروجين عالي الضغط لتفريغ الآبار وتطهير خطوط الأنابيب واختبار الضغط.',
      descriptionEn: 'We provide nitrogen services for a variety of oilfield applications including well unloading, pipeline displacement and purging, pressure testing, and inerting operations. Our nitrogen units deliver high-quality nitrogen at the flow rates and pressures required for your specific application. Safety and reliability are paramount in our nitrogen operations.',
      descriptionAr: 'نقدم خدمات النيتروجين لمجموعة متنوعة من تطبيقات حقول النفط بما في ذلك تفريغ الآبار، إزاحة وتطهير خطوط الأنابيب، اختبار الضغط، وعمليات التخميل. توفر وحدات النيتروجين لدينا نيتروجين عالي الجودة بمعدلات التدفق والضغوط المطلوبة لتطبيقك المحدد. السلامة والموثوقية هي الأهم في عمليات النيتروجين لدينا.',
      order: 3,
      isActive: true,
    },
    {
      slug: 'filtration',
      categorySlug: 'production',
      icon: 'Pipette',
      titleEn: 'Filtration Services',
      titleAr: 'خدمات الترشيح',
      shortDescriptionEn: 'Industrial filtration solutions for produced water, completion fluids, and process streams.',
      shortDescriptionAr: 'حلول الترشيح الصناعي للمياه المنتجة وسوائل الإكمال وتيارات العمليات.',
      descriptionEn: 'Our filtration services ensure fluid cleanliness for critical oilfield operations. We provide filtration solutions for completion and workover fluids, produced water treatment, and injection water preparation. Our mobile filtration units can be deployed at wellsite or processing facilities to meet your specific cleanliness requirements.',
      descriptionAr: 'تضمن خدمات الترشيح لدينا نظافة السوائل للعمليات الحرجة في حقول النفط. نقدم حلول الترشيح لسوائل الإكمال والصيانة، معالجة المياه المنتجة، وتحضير مياه الحقن. يمكن نشر وحدات الترشيح المتنقلة لدينا في موقع البئر أو مرافق المعالجة لتلبية متطلبات النظافة الخاصة بك.',
      order: 4,
      isActive: true,
    },
    {
      slug: 'pipelines',
      categorySlug: 'production',
      icon: 'Cable',
      titleEn: 'Pipelines & Industrial Services',
      titleAr: 'خدمات الأنابيب والخدمات الصناعية',
      shortDescriptionEn: 'Comprehensive pipeline construction, maintenance, and industrial support services.',
      shortDescriptionAr: 'خدمات شاملة لإنشاء وصيانة خطوط الأنابيب والدعم الصناعي.',
      descriptionEn: 'We offer complete pipeline and industrial services including pipeline construction, maintenance, pigging operations, and integrity testing. Our teams are equipped to handle both onshore pipeline projects and facility piping work. We maintain strict quality control and safety standards throughout all pipeline operations.',
      descriptionAr: 'نقدم خدمات الأنابيب والخدمات الصناعية الكاملة بما في ذلك إنشاء خطوط الأنابيب، الصيانة، عمليات التنظيف، واختبار السلامة. فرقنا مجهزة للتعامل مع مشاريع خطوط الأنابيب البرية وأعمال الأنابيب في المرافق. نحافظ على معايير صارمة لمراقبة الجودة والسلامة طوال جميع عمليات خطوط الأنابيب.',
      order: 5,
      isActive: true,
    },
    {
      slug: 'water-production',
      categorySlug: 'production',
      icon: 'Droplet',
      titleEn: 'Water & Production Assurance',
      titleAr: 'ضمان المياه والإنتاج',
      shortDescriptionEn: 'Water management and production optimization services for enhanced field performance.',
      shortDescriptionAr: 'خدمات إدارة المياه وتحسين الإنتاج لتعزيز أداء الحقل.',
      descriptionEn: 'Our water and production assurance services help optimize your field production while managing water challenges effectively. We provide water source development, injection system optimization, produced water handling, and production monitoring services. Our integrated approach ensures sustainable production while minimizing environmental impact.',
      descriptionAr: 'تساعد خدمات ضمان المياه والإنتاج لدينا في تحسين إنتاج حقلك مع إدارة تحديات المياه بفعالية. نقدم تطوير مصادر المياه، تحسين نظام الحقن، التعامل مع المياه المنتجة، وخدمات مراقبة الإنتاج. يضمن نهجنا المتكامل الإنتاج المستدام مع تقليل التأثير البيئي.',
      order: 6,
      isActive: true,
    },
    {
      slug: 'artificial-lift',
      categorySlug: 'production',
      icon: 'Target',
      titleEn: 'Artificial Lift Services',
      titleAr: 'خدمات الرفع الاصطناعي',
      shortDescriptionEn: 'Complete artificial lift solutions including ESP, rod pump, and gas lift systems.',
      shortDescriptionAr: 'حلول الرفع الاصطناعي الكاملة بما في ذلك ESP ومضخات القضيب وأنظمة رفع الغاز.',
      descriptionEn: 'We provide comprehensive artificial lift services to maximize production from your wells. Our offerings include electric submersible pumps (ESP), rod pumping systems, gas lift equipment, and progressive cavity pumps. Our artificial lift specialists work with you to select and optimize the best lift method for your well conditions and production targets.',
      descriptionAr: 'نقدم خدمات الرفع الاصطناعي الشاملة لتعظيم الإنتاج من آبارك. تشمل عروضنا المضخات الغاطسة الكهربائية (ESP)، أنظمة الضخ بالقضيب، معدات رفع الغاز، والمضخات التجويفية المتقدمة. يعمل متخصصو الرفع الاصطناعي لدينا معك لاختيار وتحسين أفضل طريقة رفع لظروف البئر وأهداف الإنتاج.',
      order: 7,
      isActive: true,
    },
    // Wireline Services (7)
    {
      slug: 'wireline-logging',
      categorySlug: 'wireline',
      icon: 'Activity',
      titleEn: 'Wireline Logging Services',
      titleAr: 'خدمات التسجيل السلكي',
      shortDescriptionEn: 'Comprehensive wireline logging services for formation evaluation and well monitoring.',
      shortDescriptionAr: 'خدمات التسجيل السلكي الشاملة لتقييم التكوينات ومراقبة الآبار.',
      descriptionEn: 'Our wireline logging services provide critical formation data for reservoir characterization and well planning. We offer open-hole and cased-hole logging suites including resistivity, porosity, sonic, and imaging tools. Our experienced logging engineers ensure data quality and provide real-time interpretation support for informed decision making.',
      descriptionAr: 'توفر خدمات التسجيل السلكي لدينا بيانات تكوينية حرجة لتوصيف المكمن وتخطيط الآبار. نقدم مجموعات تسجيل للثقب المفتوح والمغلف تشمل المقاومة، المسامية، الصوتية، وأدوات التصوير. يضمن مهندسو التسجيل ذوو الخبرة لدينا جودة البيانات ويقدمون دعم التفسير في الوقت الفعلي لاتخاذ قرارات مستنيرة.',
      order: 0,
      isActive: true,
    },
    {
      slug: 'well-testing',
      categorySlug: 'wireline',
      icon: 'TestTube',
      titleEn: 'Well Testing Services',
      titleAr: 'خدمات اختبار الآبار',
      shortDescriptionEn: 'Professional well testing services for reservoir characterization and production analysis.',
      shortDescriptionAr: 'خدمات اختبار الآبار المهنية لتوصيف المكمن وتحليل الإنتاج.',
      descriptionEn: 'We deliver well testing services that provide essential data for reservoir management and production optimization. Our services include drillstem testing, production testing, pressure transient analysis, and multi-rate testing. We operate modern test equipment with real-time data acquisition and experienced test supervisors to ensure test objectives are achieved.',
      descriptionAr: 'نقدم خدمات اختبار الآبار التي توفر بيانات أساسية لإدارة المكمن وتحسين الإنتاج. تشمل خدماتنا اختبار ساق الحفر، اختبار الإنتاج، تحليل الضغط العابر، والاختبار متعدد المعدلات. نشغل معدات اختبار حديثة مع اكتساب البيانات في الوقت الفعلي ومشرفي اختبار ذوي خبرة لضمان تحقيق أهداف الاختبار.',
      order: 1,
      isActive: true,
    },
    {
      slug: 'stimulation-pumping',
      categorySlug: 'wireline',
      icon: 'Zap',
      titleEn: 'Stimulation & Pumping',
      titleAr: 'التحفيز والضخ',
      shortDescriptionEn: 'Well stimulation and high-pressure pumping services for production enhancement.',
      shortDescriptionAr: 'خدمات تحفيز الآبار والضخ عالي الضغط لتعزيز الإنتاج.',
      descriptionEn: 'Our stimulation and pumping services help enhance well productivity through matrix acidizing, fracturing, and other stimulation treatments. We operate high-pressure pumping equipment capable of delivering treatments at the rates and pressures required for effective stimulation. Our treatment designs are optimized for your specific reservoir conditions.',
      descriptionAr: 'تساعد خدمات التحفيز والضخ لدينا في تعزيز إنتاجية الآبار من خلال المعالجة الحمضية المصفوفية، التكسير، وعلاجات التحفيز الأخرى. نشغل معدات ضخ عالية الضغط قادرة على تقديم العلاجات بالمعدلات والضغوط المطلوبة للتحفيز الفعال. تصاميم العلاج لدينا محسنة لظروف المكمن الخاصة بك.',
      order: 2,
      isActive: true,
    },
    {
      slug: 'thru-tubing',
      categorySlug: 'wireline',
      icon: 'Wrench',
      titleEn: 'Thru-Tubing Intervention',
      titleAr: 'التدخل عبر الأنابيب',
      shortDescriptionEn: 'Specialized thru-tubing services for well intervention without removing production tubing.',
      shortDescriptionAr: 'خدمات متخصصة عبر الأنابيب للتدخل في الآبار دون إزالة أنابيب الإنتاج.',
      descriptionEn: 'Our thru-tubing intervention services allow well work to be performed without pulling the production tubing, saving time and reducing costs. We offer a range of thru-tubing tools and techniques for plug setting, perforating, logging, and mechanical operations. Our intervention specialists select the optimal approach for each job.',
      descriptionAr: 'تسمح خدمات التدخل عبر الأنابيب لدينا بإجراء أعمال الآبار دون سحب أنابيب الإنتاج، مما يوفر الوقت ويقلل التكاليف. نقدم مجموعة من الأدوات والتقنيات عبر الأنابيب لتركيب السدادات، التثقيب، التسجيل، والعمليات الميكانيكية. يختار متخصصو التدخل لدينا النهج الأمثل لكل عمل.',
      order: 3,
      isActive: true,
    },
    {
      slug: 'slickline',
      categorySlug: 'wireline',
      icon: 'Cable',
      titleEn: 'Slickline Services',
      titleAr: 'خدمات السلك الناعم (Slickline)',
      shortDescriptionEn: 'Efficient slickline services for routine well maintenance and intervention operations.',
      shortDescriptionAr: 'خدمات السلك الناعم الفعالة للصيانة الروتينية للآبار وعمليات التدخل.',
      descriptionEn: 'We provide slickline services for a wide range of well intervention tasks including gauge operations, valve manipulation, plug setting and retrieval, and depth correlation. Our slickline units are equipped with modern measuring and recording systems. Our operators have extensive experience in both open-hole and cased-hole slickline operations.',
      descriptionAr: 'نقدم خدمات السلك الناعم لمجموعة واسعة من مهام التدخل في الآبار بما في ذلك عمليات القياس، التحكم في الصمامات، تركيب واسترجاع السدادات، وربط العمق. وحدات السلك الناعم لدينا مجهزة بأنظمة قياس وتسجيل حديثة. مشغلونا لديهم خبرة واسعة في عمليات السلك الناعم للثقب المفتوح والمغلف.',
      order: 4,
      isActive: true,
    },
    {
      slug: 'completions',
      categorySlug: 'wireline',
      icon: 'Settings',
      titleEn: 'Completions',
      titleAr: 'الإكمالات',
      shortDescriptionEn: 'Full well completion services from design through installation and commissioning.',
      shortDescriptionAr: 'خدمات إكمال الآبار الكاملة من التصميم حتى التركيب والتشغيل.',
      descriptionEn: 'Our completion services cover the full scope of well completion activities from initial design to installation and commissioning. We provide completion equipment including packers, tubing, safety valves, and wellhead systems. Our completion engineers work closely with clients to develop optimal completion designs for long-term well performance.',
      descriptionAr: 'تغطي خدمات الإكمال لدينا النطاق الكامل لأنشطة إكمال الآبار من التصميم الأولي إلى التركيب والتشغيل. نقدم معدات الإكمال بما في ذلك العوازل، الأنابيب، صمامات الأمان، وأنظمة رأس البئر. يعمل مهندسو الإكمال لدينا بشكل وثيق مع العملاء لتطوير تصاميم إكمال مثلى لأداء البئر على المدى الطويل.',
      order: 5,
      isActive: true,
    },
    {
      slug: 'scaffolding',
      categorySlug: 'wireline',
      icon: 'Boxes',
      titleEn: 'Scaffolding Services',
      titleAr: 'خدمات السقالات',
      shortDescriptionEn: 'Professional scaffolding solutions for safe access during well and facility operations.',
      shortDescriptionAr: 'حلول السقالات المهنية للوصول الآمن أثناء عمليات الآبار والمرافق.',
      descriptionEn: 'We provide comprehensive scaffolding services for oilfield and industrial applications. Our certified scaffolding crews erect safe working platforms for drilling, workover, and facility maintenance operations. We use quality scaffolding materials and follow strict safety protocols to ensure reliable access solutions for work at height.',
      descriptionAr: 'نقدم خدمات السقالات الشاملة لتطبيقات حقول النفط والصناعة. تقوم أطقم السقالات المعتمدة لدينا بتركيب منصات عمل آمنة لعمليات الحفر والصيانة وصيانة المرافق. نستخدم مواد سقالات عالية الجودة ونتبع بروتوكولات سلامة صارمة لضمان حلول وصول موثوقة للعمل على ارتفاع.',
      order: 6,
      isActive: true,
    },
    // Consultancy Services (8)
    {
      slug: 'import-machinery',
      categorySlug: 'consultancy',
      icon: 'Truck',
      titleEn: 'Importing Machinery',
      titleAr: 'استيراد الآلات',
      shortDescriptionEn: 'Machinery import services including sourcing, procurement, and logistics coordination.',
      shortDescriptionAr: 'خدمات استيراد الآلات بما في ذلك التوريد والشراء وتنسيق اللوجستيات.',
      descriptionEn: 'We facilitate the import of oilfield and industrial machinery from global suppliers. Our services cover equipment sourcing, vendor qualification, procurement management, and logistics coordination. We ensure that imported equipment meets specifications and arrives on schedule to support your operations.',
      descriptionAr: 'نسهل استيراد الآلات النفطية والصناعية من الموردين العالميين. تغطي خدماتنا توريد المعدات، تأهيل الموردين، إدارة المشتريات، وتنسيق اللوجستيات. نضمن أن المعدات المستوردة تلبي المواصفات وتصل في الموعد المحدد لدعم عملياتك.',
      order: 0,
      isActive: true,
    },
    {
      slug: 'import-chemicals',
      categorySlug: 'consultancy',
      icon: 'FlaskConical',
      titleEn: 'Importing Chemicals',
      titleAr: 'استيراد المواد الكيميائية',
      shortDescriptionEn: 'Chemical import and supply chain management for oilfield and industrial applications.',
      shortDescriptionAr: 'استيراد المواد الكيميائية وإدارة سلسلة التوريد للتطبيقات النفطية والصناعية.',
      descriptionEn: 'We manage the import of specialty chemicals for oilfield and industrial applications. Our chemical supply services include sourcing from qualified manufacturers, regulatory compliance, proper handling and storage, and just-in-time delivery. We ensure chemical quality and availability to support your production operations.',
      descriptionAr: 'ندير استيراد المواد الكيميائية المتخصصة للتطبيقات النفطية والصناعية. تشمل خدمات توريد المواد الكيميائية لدينا التوريد من الشركات المصنعة المؤهلة، الامتثال التنظيمي، التعامل والتخزين المناسب، والتسليم في الوقت المناسب. نضمن جودة المواد الكيميائية وتوافرها لدعم عمليات الإنتاج الخاصة بك.',
      order: 1,
      isActive: true,
    },
    {
      slug: 'import-gas-station',
      categorySlug: 'consultancy',
      icon: 'Fuel',
      titleEn: 'Importing Gas Station Equipment',
      titleAr: 'استيراد معدات محطات الوقود',
      shortDescriptionEn: 'Complete gas station equipment sourcing and import services.',
      shortDescriptionAr: 'خدمات توريد واستيراد معدات محطات الوقود الكاملة.',
      descriptionEn: 'We provide import services for gas station equipment including dispensers, underground tanks, canopy structures, and point-of-sale systems. Our team handles equipment selection, procurement, shipping, and customs clearance. We support new station construction and equipment upgrades for existing facilities.',
      descriptionAr: 'نقدم خدمات الاستيراد لمعدات محطات الوقود بما في ذلك الموزعات، الخزانات تحت الأرض، هياكل المظلات، وأنظمة نقاط البيع. يتعامل فريقنا مع اختيار المعدات، الشراء، الشحن، والتخليص الجمركي. ندعم بناء المحطات الجديدة وترقيات المعدات للمرافق القائمة.',
      order: 2,
      isActive: true,
    },
    {
      slug: 'processing',
      categorySlug: 'consultancy',
      icon: 'Factory',
      titleEn: 'Processing & Supplying',
      titleAr: 'المعالجة والتوريد',
      shortDescriptionEn: 'Processing and supply services for oilfield materials and equipment.',
      shortDescriptionAr: 'خدمات المعالجة والتوريد للمواد والمعدات النفطية.',
      descriptionEn: 'Our processing and supply services provide reliable sourcing of materials and equipment for oilfield operations. We maintain strategic inventories and supplier relationships to ensure timely availability of critical items. Our supply chain expertise helps optimize procurement costs while maintaining quality and delivery reliability.',
      descriptionAr: 'توفر خدمات المعالجة والتوريد لدينا توريداً موثوقاً للمواد والمعدات لعمليات حقول النفط. نحافظ على مخزونات استراتيجية وعلاقات مع الموردين لضمان توافر العناصر الحرجة في الوقت المناسب. تساعد خبرتنا في سلسلة التوريد على تحسين تكاليف الشراء مع الحفاظ على الجودة وموثوقية التسليم.',
      order: 3,
      isActive: true,
    },
    {
      slug: 'customs-clearance',
      categorySlug: 'consultancy',
      icon: 'ClipboardCheck',
      titleEn: 'Customs Clearance',
      titleAr: 'التخليص الجمركي',
      shortDescriptionEn: 'Efficient customs clearance services for oilfield equipment and materials.',
      shortDescriptionAr: 'خدمات التخليص الجمركي الفعالة للمعدات والمواد النفطية.',
      descriptionEn: 'We provide customs clearance services to facilitate the smooth import and export of oilfield equipment and materials. Our experienced customs team handles all documentation, tariff classifications, and regulatory requirements. We work to minimize delays and ensure compliance with local customs regulations.',
      descriptionAr: 'نقدم خدمات التخليص الجمركي لتسهيل استيراد وتصدير المعدات والمواد النفطية بسلاسة. يتعامل فريق الجمارك ذو الخبرة لدينا مع جميع الوثائق، تصنيفات التعرفة، والمتطلبات التنظيمية. نعمل على تقليل التأخيرات وضمان الامتثال للوائح الجمارك المحلية.',
      order: 4,
      isActive: true,
    },
    {
      slug: 'explosives',
      categorySlug: 'consultancy',
      icon: 'Flame',
      titleEn: 'Explosive Services',
      titleAr: 'خدمات المتفجرات',
      shortDescriptionEn: 'Licensed explosive services for perforating and seismic operations.',
      shortDescriptionAr: 'خدمات المتفجرات المرخصة لعمليات التثقيب والمسح الزلزالي.',
      descriptionEn: 'We provide licensed explosive services for oilfield applications including well perforating, pipe cutting, and seismic surveying. Our explosive handling follows strict safety protocols and regulatory compliance. All operations are performed by certified personnel with comprehensive safety training and experience.',
      descriptionAr: 'نقدم خدمات المتفجرات المرخصة لتطبيقات حقول النفط بما في ذلك تثقيب الآبار، قطع الأنابيب، والمسح الزلزالي. يتبع التعامل مع المتفجرات لدينا بروتوكولات سلامة صارمة والامتثال التنظيمي. يتم تنفيذ جميع العمليات بواسطة موظفين معتمدين مع تدريب شامل على السلامة والخبرة.',
      order: 5,
      isActive: true,
    },
    {
      slug: 'inspection',
      categorySlug: 'consultancy',
      icon: 'FileSearch',
      titleEn: 'Inspection Services',
      titleAr: 'خدمات التفتيش',
      shortDescriptionEn: 'Third-party inspection services for equipment, materials, and operations.',
      shortDescriptionAr: 'خدمات التفتيش من طرف ثالث للمعدات والمواد والعمليات.',
      descriptionEn: 'Our inspection services provide independent verification of equipment condition, material quality, and operational compliance. We offer pre-shipment inspection, receiving inspection, in-service inspection, and certification services. Our qualified inspectors follow industry standards to ensure equipment integrity and safety.',
      descriptionAr: 'توفر خدمات التفتيش لدينا التحقق المستقل من حالة المعدات، جودة المواد، والامتثال التشغيلي. نقدم فحص ما قبل الشحن، فحص الاستلام، الفحص أثناء الخدمة، وخدمات الشهادات. يتبع مفتشونا المؤهلون معايير الصناعة لضمان سلامة المعدات والأمان.',
      order: 6,
      isActive: true,
    },
    {
      slug: 'training',
      categorySlug: 'consultancy',
      icon: 'GraduationCap',
      titleEn: 'Training & Technical Support',
      titleAr: 'التدريب والدعم الفني',
      shortDescriptionEn: 'Technical training programs and ongoing support for oilfield operations.',
      shortDescriptionAr: 'برامج التدريب الفني والدعم المستمر لعمليات حقول النفط.',
      descriptionEn: 'We provide technical training and support services to develop local workforce capabilities. Our training programs cover equipment operation, safety procedures, and technical skills development. We also offer ongoing technical support and mentoring to ensure operational excellence and continuous improvement.',
      descriptionAr: 'نقدم خدمات التدريب الفني والدعم لتطوير قدرات القوى العاملة المحلية. تغطي برامجنا التدريبية تشغيل المعدات، إجراءات السلامة، وتطوير المهارات التقنية. نقدم أيضاً الدعم الفني المستمر والتوجيه لضمان التميز التشغيلي والتحسين المستمر.',
      order: 7,
      isActive: true,
    },
    // Other Services (3)
    {
      slug: 'fuel-stations',
      categorySlug: 'other',
      icon: 'Fuel',
      titleEn: 'Fuel Stations Maintenance',
      titleAr: 'صيانة محطات الوقود',
      shortDescriptionEn: 'Comprehensive maintenance services for fuel station equipment and facilities.',
      shortDescriptionAr: 'خدمات الصيانة الشاملة لمعدات ومرافق محطات الوقود.',
      descriptionEn: 'We provide maintenance services for fuel stations including dispenser servicing, tank inspection, electrical systems maintenance, and facility upkeep. Our technicians are trained to work on various equipment brands and ensure stations operate safely and efficiently. We offer both scheduled maintenance programs and emergency repair services.',
      descriptionAr: 'نقدم خدمات الصيانة لمحطات الوقود بما في ذلك صيانة الموزعات، فحص الخزانات، صيانة الأنظمة الكهربائية، وصيانة المرافق. فنيونا مدربون للعمل على علامات تجارية مختلفة من المعدات وضمان تشغيل المحطات بأمان وكفاءة. نقدم برامج الصيانة المجدولة وخدمات الإصلاح الطارئ.',
      order: 0,
      isActive: true,
    },
    {
      slug: 'mud-logging',
      categorySlug: 'other',
      icon: 'Gauge',
      titleEn: 'Mud Logging Services',
      titleAr: 'خدمات تسجيل الطين',
      shortDescriptionEn: 'Real-time mud logging and geological monitoring during drilling operations.',
      shortDescriptionAr: 'تسجيل الطين في الوقت الفعلي والمراقبة الجيولوجية أثناء عمليات الحفر.',
      descriptionEn: 'Our mud logging services provide real-time geological and drilling information during drilling operations. We deploy modern mud logging units with experienced geologists to monitor drilling parameters, analyze cuttings, and detect hydrocarbon shows. Our data helps optimize drilling decisions and identify potential pay zones.',
      descriptionAr: 'توفر خدمات تسجيل الطين لدينا معلومات جيولوجية وحفر في الوقت الفعلي أثناء عمليات الحفر. ننشر وحدات تسجيل طين حديثة مع جيولوجيين ذوي خبرة لمراقبة معايير الحفر، تحليل القطع، واكتشاف علامات الهيدروكربون. تساعد بياناتنا في تحسين قرارات الحفر وتحديد المناطق المنتجة المحتملة.',
      order: 1,
      isActive: true,
    },
    {
      slug: 'integrated-drilling',
      categorySlug: 'other',
      icon: 'Compass',
      titleEn: 'Integrated Drilling Services',
      titleAr: 'خدمات الحفر المتكاملة',
      shortDescriptionEn: 'Complete integrated drilling project management and execution services.',
      shortDescriptionAr: 'خدمات إدارة وتنفيذ مشاريع الحفر المتكاملة الكاملة.',
      descriptionEn: 'We offer integrated drilling services that combine multiple service lines under single-point project management. Our integrated approach streamlines operations, improves coordination between service providers, and optimizes overall drilling performance. We take responsibility for delivering wells safely, on time, and within budget.',
      descriptionAr: 'نقدم خدمات الحفر المتكاملة التي تجمع خطوط خدمة متعددة تحت إدارة مشروع من نقطة واحدة. يبسط نهجنا المتكامل العمليات، يحسن التنسيق بين مقدمي الخدمات، ويحسن أداء الحفر الإجمالي. نتحمل المسؤولية عن تسليم الآبار بأمان، في الوقت المحدد، وضمن الميزانية.',
      order: 2,
      isActive: true,
    },
  ]

  for (const service of services) {
    const { categorySlug, ...serviceData } = service
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        ...serviceData,
        categoryId: categoryMap[categorySlug],
      },
    })
  }
  console.log('✅ Created services (26)')

  // Create offices
  const offices = [
    {
      slug: 'basrah',
      nameEn: 'Basrah',
      nameAr: 'البصرة',
      addressEn: 'Basrah, Iraq',
      addressAr: 'البصرة، العراق',
      phone: '+964XXXXXXXXXX',
      phoneDisplay: '+964 XXX XXX XXXX',
      email: 'basrah@jerash.com',
      hoursEn: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      hoursAr: 'الأحد - الخميس: 8:00 صباحاً - 4:00 مساءً',
      latitude: 30.4915,
      longitude: 47.7804,
      order: 0,
      isActive: true,
    },
    {
      slug: 'erbil',
      nameEn: 'Erbil',
      nameAr: 'أربيل',
      addressEn: 'Erbil, Kurdistan Region, Iraq',
      addressAr: 'أربيل، إقليم كردستان، العراق',
      phone: '+964XXXXXXXXXX',
      phoneDisplay: '+964 XXX XXX XXXX',
      email: 'erbil@jerash.com',
      hoursEn: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      hoursAr: 'الأحد - الخميس: 8:00 صباحاً - 4:00 مساءً',
      latitude: 36.191,
      longitude: 44.0094,
      order: 1,
      isActive: true,
    },
    {
      slug: 'baghdad',
      nameEn: 'Baghdad',
      nameAr: 'بغداد',
      addressEn: 'Baghdad, Iraq',
      addressAr: 'بغداد، العراق',
      phone: '+964XXXXXXXXXX',
      phoneDisplay: '+964 XXX XXX XXXX',
      email: 'baghdad@jerash.com',
      hoursEn: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      hoursAr: 'الأحد - الخميس: 8:00 صباحاً - 4:00 مساءً',
      latitude: 33.3152,
      longitude: 44.3661,
      order: 2,
      isActive: true,
    },
  ]

  for (const office of offices) {
    await prisma.office.upsert({
      where: { slug: office.slug },
      update: {},
      create: office,
    })
  }
  console.log('✅ Created offices (3)')

  // Create partner
  await prisma.partner.upsert({
    where: { slug: 'slb' },
    update: {},
    create: {
      slug: 'slb',
      nameEn: 'SLB (Schlumberger)',
      nameAr: 'إس إل بي (شلمبرجر)',
      descriptionEn: 'SLB is a global technology company driving energy innovation. As a leading partner, SLB brings world-class expertise in oil field technology and services to our operations.',
      descriptionAr: 'إس إل بي هي شركة تكنولوجيا عالمية تقود الابتكار في مجال الطاقة. كشريك رائد، تجلب إس إل بي خبرة عالمية المستوى في تكنولوجيا وخدمات حقول النفط لعملياتنا.',
      logoUrl: '/uploads/partners/slb-logo.png',
      website: 'https://www.slb.com',
      order: 0,
      isActive: true,
    },
  })
  console.log('✅ Created partner (SLB)')

  // Create joint venture
  await prisma.jointVenture.upsert({
    where: { slug: 'kweti' },
    update: {},
    create: {
      slug: 'kweti',
      nameEn: 'Jerash for Energy Services',
      nameAr: 'جرش لخدمات الطاقة',
      descriptionEn: 'Jerash for Energy Services is a strategic joint venture expanding Jerash\'s capabilities in integrated energy services across the region.',
      descriptionAr: 'جرش لخدمات الطاقة هي مشروع مشترك استراتيجي يوسع قدرات جرش في خدمات الطاقة المتكاملة عبر المنطقة.',
      logoUrl: '/uploads/partners/kweti-logo.png',
      order: 0,
      isActive: true,
    },
  })
  console.log('✅ Created joint venture (KWETI)')

  // Create gallery images (26)
  const galleryImages = [
    { imageUrl: '/uploads/gallery/jerash-site-01.jpg', altEn: 'Oil field workers in safety gear conducting drilling operations', altAr: 'عمال حقول النفط بملابس السلامة يقومون بعمليات الحفر', width: 1600, height: 1000, order: 0 },
    { imageUrl: '/uploads/gallery/jerash-site-02.jpg', altEn: 'Tall drilling rig tower against clear sky at Jerash site', altAr: 'برج حفر طويل مقابل سماء صافية في موقع جرش', width: 900, height: 1200, order: 1 },
    { imageUrl: '/uploads/gallery/jerash-site-03.jpg', altEn: 'Heavy equipment and machinery at the oil field staging area', altAr: 'معدات ثقيلة وآلات في منطقة التجهيز بحقل النفط', width: 1200, height: 900, order: 2 },
    { imageUrl: '/uploads/gallery/jerash-site-04.jpg', altEn: 'Pipeline construction crew installing new pipeline sections', altAr: 'طاقم إنشاء خطوط الأنابيب يقومون بتركيب أقسام جديدة', width: 1600, height: 1000, order: 3 },
    { imageUrl: '/uploads/gallery/jerash-site-05.jpg', altEn: 'Worker inspecting vertical wellhead equipment', altAr: 'عامل يفحص معدات رأس البئر العمودي', width: 900, height: 1200, order: 4 },
    { imageUrl: '/uploads/gallery/jerash-site-06.jpg', altEn: 'Control room operators monitoring production systems', altAr: 'مشغلو غرفة التحكم يراقبون أنظمة الإنتاج', width: 1200, height: 900, order: 5 },
    { imageUrl: '/uploads/gallery/jerash-site-07.jpg', altEn: 'Safety meeting with field crew before operations begin', altAr: 'اجتماع السلامة مع طاقم الميدان قبل بدء العمليات', width: 1600, height: 1000, order: 6 },
    { imageUrl: '/uploads/gallery/jerash-site-08.jpg', altEn: 'Coiled tubing unit deployed for well intervention', altAr: 'وحدة الأنابيب الملفوفة منتشرة للتدخل في البئر', width: 900, height: 1200, order: 7 },
    { imageUrl: '/uploads/gallery/jerash-site-09.jpg', altEn: 'Wireline logging equipment being prepared for deployment', altAr: 'معدات التسجيل السلكي يتم تحضيرها للنشر', width: 1200, height: 900, order: 8 },
    { imageUrl: '/uploads/gallery/jerash-site-10.jpg', altEn: 'Oil storage tanks and processing facilities at the field', altAr: 'خزانات تخزين النفط ومرافق المعالجة في الحقل', width: 1600, height: 1000, order: 9 },
    { imageUrl: '/uploads/gallery/jerash-site-11.jpg', altEn: 'Technician performing maintenance on pumping equipment', altAr: 'فني يقوم بصيانة معدات الضخ', width: 900, height: 1200, order: 10 },
    { imageUrl: '/uploads/gallery/jerash-site-12.jpg', altEn: 'Well testing operations with data collection equipment', altAr: 'عمليات اختبار الآبار مع معدات جمع البيانات', width: 1200, height: 900, order: 11 },
    { imageUrl: '/uploads/gallery/jerash-site-13.jpg', altEn: 'Team of workers coordinating heavy lift operations', altAr: 'فريق من العمال ينسقون عمليات الرفع الثقيل', width: 1600, height: 1000, order: 12 },
    { imageUrl: '/uploads/gallery/jerash-site-14.jpg', altEn: 'Cement pump truck ready for well cementing operations', altAr: 'شاحنة مضخة الأسمنت جاهزة لعمليات تأسيس البئر', width: 900, height: 1200, order: 13 },
    { imageUrl: '/uploads/gallery/jerash-site-15.jpg', altEn: 'PPE equipment station with hard hats and safety vests', altAr: 'محطة معدات الحماية الشخصية مع الخوذ وسترات السلامة', width: 1200, height: 900, order: 14 },
    { imageUrl: '/uploads/gallery/jerash-site-16.jpg', altEn: 'Panoramic view of active drilling site at sunrise', altAr: 'منظر بانورامي لموقع الحفر النشط عند شروق الشمس', width: 1600, height: 1000, order: 15 },
    { imageUrl: '/uploads/gallery/jerash-site-17.jpg', altEn: 'Nitrogen pumping unit for well stimulation services', altAr: 'وحدة ضخ النيتروجين لخدمات تحفيز الآبار', width: 900, height: 1200, order: 16 },
    { imageUrl: '/uploads/gallery/jerash-site-18.jpg', altEn: 'Field office and crew quarters at remote location', altAr: 'مكتب ميداني ومساكن الطاقم في موقع بعيد', width: 1200, height: 900, order: 17 },
    { imageUrl: '/uploads/gallery/jerash-site-19.jpg', altEn: 'Workers connecting drill pipe during tripping operations', altAr: 'عمال يوصلون أنابيب الحفر أثناء عمليات السحب', width: 1600, height: 1000, order: 18 },
    { imageUrl: '/uploads/gallery/jerash-site-20.jpg', altEn: 'Mud logging unit monitoring drilling parameters', altAr: 'وحدة تسجيل الطين تراقب معايير الحفر', width: 900, height: 1200, order: 19 },
    { imageUrl: '/uploads/gallery/jerash-site-21.jpg', altEn: 'Scaffolding erected around production equipment for maintenance', altAr: 'سقالات منصوبة حول معدات الإنتاج للصيانة', width: 1200, height: 900, order: 20 },
    { imageUrl: '/uploads/gallery/jerash-site-22.jpg', altEn: 'Fleet of service vehicles and equipment transport trucks', altAr: 'أسطول من مركبات الخدمة وشاحنات نقل المعدات', width: 1600, height: 1000, order: 21 },
    { imageUrl: '/uploads/gallery/jerash-site-23.jpg', altEn: 'Worker climbing rig derrick with proper fall protection', altAr: 'عامل يتسلق برج الحفر مع حماية مناسبة من السقوط', width: 900, height: 1200, order: 22 },
    { imageUrl: '/uploads/gallery/jerash-site-24.jpg', altEn: 'Quality control inspection of drilling fluid samples', altAr: 'فحص مراقبة الجودة لعينات سائل الحفر', width: 1200, height: 900, order: 23 },
    { imageUrl: '/uploads/gallery/jerash-site-25.jpg', altEn: 'Evening operations with rig lights illuminating the site', altAr: 'عمليات مسائية مع أضواء الحفارة تضيء الموقع', width: 1600, height: 1000, order: 24 },
    { imageUrl: '/uploads/gallery/jerash-site-26.jpg', altEn: 'Senior engineer reviewing well completion diagrams on tablet', altAr: 'مهندس أول يراجع مخططات إكمال البئر على جهاز لوحي', width: 900, height: 1200, order: 25 },
  ]

  for (let i = 0; i < galleryImages.length; i++) {
    const image = galleryImages[i]
    await prisma.galleryImage.upsert({
      where: { id: `gallery-image-${i}` },
      update: image,
      create: { id: `gallery-image-${i}`, ...image, isActive: true },
    })
  }
  console.log('✅ Created gallery images (26)')

  // Create jobs (5)
  const jobs = [
    {
      slug: 'petroleum-engineer',
      titleEn: 'Petroleum Engineer',
      titleAr: 'مهندس بترول',
      departmentEn: 'Engineering',
      departmentAr: 'الهندسة',
      locationEn: 'Basrah, Iraq',
      locationAr: 'البصرة، العراق',
      typeEn: 'Full-time',
      typeAr: 'دوام كامل',
      descriptionEn: 'Design and implement efficient drilling and production operations for oil and gas extraction.',
      descriptionAr: 'تصميم وتنفيذ عمليات الحفر والإنتاج الفعالة لاستخراج النفط والغاز.',
      fullDescriptionEn: `We are seeking an experienced Petroleum Engineer to join our Engineering team in Basrah. The successful candidate will be responsible for designing and implementing efficient drilling and production operations.

Responsibilities:
- Design well completion and stimulation programs
- Analyze reservoir performance and optimize production
- Collaborate with drilling teams to ensure safe operations
- Prepare technical reports and recommendations

Requirements:
- Bachelor's degree in Petroleum Engineering or related field
- 5+ years of experience in oil field operations
- Strong knowledge of drilling and completion techniques
- Excellent communication skills in English and Arabic`,
      fullDescriptionAr: `نبحث عن مهندس بترول ذي خبرة للانضمام إلى فريق الهندسة في البصرة. سيكون المرشح الناجح مسؤولاً عن تصميم وتنفيذ عمليات الحفر والإنتاج الفعالة.

المسؤوليات:
- تصميم برامج إكمال الآبار والتحفيز
- تحليل أداء المكمن وتحسين الإنتاج
- التعاون مع فرق الحفر لضمان العمليات الآمنة
- إعداد التقارير الفنية والتوصيات

المتطلبات:
- درجة البكالوريوس في هندسة البترول أو مجال ذي صلة
- خبرة 5+ سنوات في عمليات حقول النفط
- معرفة قوية بتقنيات الحفر والإكمال
- مهارات تواصل ممتازة بالإنجليزية والعربية`,
      isActive: true,
    },
    {
      slug: 'hse-officer',
      titleEn: 'HSE Officer',
      titleAr: 'مسؤول الصحة والسلامة والبيئة',
      departmentEn: 'Health, Safety & Environment',
      departmentAr: 'الصحة والسلامة والبيئة',
      locationEn: 'Erbil, Iraq',
      locationAr: 'أربيل، العراق',
      typeEn: 'Full-time',
      typeAr: 'دوام كامل',
      descriptionEn: 'Ensure compliance with HSE standards and promote a culture of safety across all operations.',
      descriptionAr: 'ضمان الامتثال لمعايير الصحة والسلامة والبيئة وتعزيز ثقافة السلامة في جميع العمليات.',
      fullDescriptionEn: `Join our HSE team as an HSE Officer in Erbil. You will play a critical role in maintaining our safety-first culture and ensuring compliance with international HSE standards.

Responsibilities:
- Conduct regular safety inspections and audits
- Develop and deliver safety training programs
- Investigate incidents and implement corrective actions
- Monitor compliance with HSE policies and regulations

Requirements:
- Bachelor's degree in Occupational Health & Safety or related field
- NEBOSH or equivalent certification
- 3+ years of HSE experience in oil and gas industry
- Strong knowledge of OSHA and ISO 45001 standards`,
      fullDescriptionAr: `انضم إلى فريق الصحة والسلامة والبيئة كمسؤول في أربيل. ستلعب دوراً حاسماً في الحفاظ على ثقافة السلامة أولاً وضمان الامتثال لمعايير الصحة والسلامة والبيئة الدولية.

المسؤوليات:
- إجراء عمليات تفتيش وتدقيق السلامة بانتظام
- تطوير وتقديم برامج التدريب على السلامة
- التحقيق في الحوادث وتنفيذ الإجراءات التصحيحية
- مراقبة الامتثال لسياسات وأنظمة الصحة والسلامة والبيئة

المتطلبات:
- درجة البكالوريوس في الصحة والسلامة المهنية أو مجال ذي صلة
- شهادة NEBOSH أو ما يعادلها
- خبرة 3+ سنوات في الصحة والسلامة والبيئة في صناعة النفط والغاز
- معرفة قوية بمعايير OSHA و ISO 45001`,
      isActive: true,
    },
    {
      slug: 'wireline-operator',
      titleEn: 'Wireline Operator',
      titleAr: 'مشغل السلك الأسلاك (Wireline)',
      departmentEn: 'Operations',
      departmentAr: 'العمليات',
      locationEn: 'Basrah, Iraq',
      locationAr: 'البصرة، العراق',
      typeEn: 'Full-time',
      typeAr: 'دوام كامل',
      descriptionEn: 'Operate wireline equipment for well logging, perforating, and intervention services.',
      descriptionAr: 'تشغيل معدات الأسلاك لقياس الآبار والتثقيب وخدمات التدخل.',
      fullDescriptionEn: `We are looking for a skilled Wireline Operator to join our Operations team in Basrah. You will be responsible for operating wireline equipment and ensuring safe execution of well services.

Responsibilities:
- Operate open-hole and cased-hole wireline equipment
- Perform well logging and perforating operations
- Conduct equipment maintenance and troubleshooting
- Ensure compliance with safety procedures

Requirements:
- Technical diploma or equivalent certification
- 3+ years of wireline operations experience
- Valid H2S and well control certifications
- Ability to work in a rotational field schedule`,
      fullDescriptionAr: `نبحث عن مشغل أسلاك ماهر للانضمام إلى فريق العمليات في البصرة. ستكون مسؤولاً عن تشغيل معدات الأسلاك وضمان التنفيذ الآمن لخدمات الآبار.

المسؤوليات:
- تشغيل معدات الأسلاك للثقب المفتوح والمغلف
- إجراء عمليات قياس الآبار والتثقيب
- صيانة المعدات واستكشاف الأخطاء وإصلاحها
- ضمان الامتثال لإجراءات السلامة

المتطلبات:
- دبلوم تقني أو شهادة معادلة
- خبرة 3+ سنوات في عمليات الأسلاك
- شهادات H2S والتحكم في الآبار سارية المفعول
- القدرة على العمل بنظام المناوبات الميدانية`,
      isActive: true,
    },
    {
      slug: 'accountant',
      titleEn: 'Accountant',
      titleAr: 'محاسب',
      departmentEn: 'Finance',
      departmentAr: 'المالية',
      locationEn: 'Baghdad, Iraq',
      locationAr: 'بغداد، العراق',
      typeEn: 'Full-time',
      typeAr: 'دوام كامل',
      descriptionEn: 'Manage financial records, prepare reports, and ensure compliance with accounting standards.',
      descriptionAr: 'إدارة السجلات المالية وإعداد التقارير وضمان الامتثال لمعايير المحاسبة.',
      fullDescriptionEn: `We are hiring an Accountant to join our Finance team in Baghdad. The ideal candidate will have strong analytical skills and experience in corporate accounting.

Responsibilities:
- Maintain accurate financial records and ledgers
- Prepare monthly financial statements and reports
- Process accounts payable and receivable
- Assist with annual audits and tax compliance

Requirements:
- Bachelor's degree in Accounting or Finance
- CPA or equivalent certification preferred
- 3+ years of accounting experience
- Proficiency in accounting software and Excel`,
      fullDescriptionAr: `نوظف محاسباً للانضمام إلى فريق المالية في بغداد. المرشح المثالي سيمتلك مهارات تحليلية قوية وخبرة في المحاسبة المؤسسية.

المسؤوليات:
- الحفاظ على السجلات المالية والدفاتر الدقيقة
- إعداد البيانات المالية الشهرية والتقارير
- معالجة الحسابات الدائنة والمدينة
- المساعدة في عمليات التدقيق السنوية والامتثال الضريبي

المتطلبات:
- درجة البكالوريوس في المحاسبة أو المالية
- يفضل شهادة CPA أو ما يعادلها
- خبرة 3+ سنوات في المحاسبة
- إتقان برامج المحاسبة وExcel`,
      isActive: true,
    },
    {
      slug: 'field-technician',
      titleEn: 'Field Technician',
      titleAr: 'فني ميداني',
      departmentEn: 'Technical Services',
      departmentAr: 'الخدمات الفنية',
      locationEn: 'Basrah, Iraq',
      locationAr: 'البصرة، العراق',
      typeEn: 'Full-time',
      typeAr: 'دوام كامل',
      descriptionEn: 'Provide technical support for field equipment maintenance and operations.',
      descriptionAr: 'تقديم الدعم الفني لصيانة المعدات الميدانية والعمليات.',
      fullDescriptionEn: `Join our Technical Services team as a Field Technician in Basrah. You will provide hands-on technical support for equipment maintenance and field operations.

Responsibilities:
- Perform routine maintenance on field equipment
- Troubleshoot mechanical and electrical issues
- Support installation and commissioning activities
- Document maintenance activities and reports

Requirements:
- Technical diploma in Mechanical or Electrical Engineering
- 2+ years of field technician experience
- Strong troubleshooting and problem-solving skills
- Willingness to work in remote field locations`,
      fullDescriptionAr: `انضم إلى فريق الخدمات الفنية كفني ميداني في البصرة. ستقدم دعماً فنياً عملياً لصيانة المعدات والعمليات الميدانية.

المسؤوليات:
- إجراء الصيانة الدورية على المعدات الميدانية
- استكشاف المشكلات الميكانيكية والكهربائية وإصلاحها
- دعم أنشطة التركيب والتشغيل
- توثيق أنشطة الصيانة والتقارير

المتطلبات:
- دبلوم تقني في الهندسة الميكانيكية أو الكهربائية
- خبرة 2+ سنوات كفني ميداني
- مهارات قوية في استكشاف الأخطاء وحل المشكلات
- الاستعداد للعمل في المواقع الميدانية النائية`,
      isActive: true,
    },
  ]

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      update: {},
      create: job,
    })
  }
  console.log('✅ Created jobs (5)')

  console.log('🎉 Seeding completed with all production data!')
  console.log('')
  console.log('Summary:')
  console.log('- 1 Admin user')
  console.log('- 5 Site settings')
  console.log('- 4 Hero slides')
  console.log('- 4 Service categories')
  console.log('- 26 Services')
  console.log('- 3 Offices')
  console.log('- 1 Partner (SLB)')
  console.log('- 1 Joint Venture (KWETI)')
  console.log('- 26 Gallery images')
  console.log('- 5 Jobs')
  console.log('Total: 76 records')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
