$ErrorActionPreference = "Stop"

$outputPath = "D:\optimized retail inventiry management system\Optimized_Retail_Inventory_Project_Report_30_Pages.docx"

function Add-Paragraph {
  param(
    [object]$Selection,
    [string]$Text,
    [int]$FontSize = 11,
    [bool]$Bold = $false,
    [int]$Color = 0,
    [int]$Alignment = 0,
    [double]$SpaceAfter = 8,
    [double]$SpaceBefore = 0
  )

  $Selection.Font.Bold = [int]$Bold
  $Selection.Font.Size = $FontSize
  if ($Color -ne 0) {
    $Selection.Font.Color = $Color
  } else {
    $Selection.Font.Color = 0
  }
  $Selection.ParagraphFormat.Alignment = $Alignment
  $Selection.ParagraphFormat.SpaceAfter = $SpaceAfter
  $Selection.ParagraphFormat.SpaceBefore = $SpaceBefore
  $Selection.TypeText($Text)
  $Selection.TypeParagraph()
}

function Add-BulletList {
  param(
    [object]$Selection,
    [string[]]$Items
  )

  foreach ($item in $Items) {
    $Selection.Range.ListFormat.ApplyBulletDefault()
    $Selection.Font.Bold = 0
    $Selection.Font.Size = 11
    $Selection.TypeText($item)
    $Selection.TypeParagraph()
  }
  $Selection.Range.ListFormat.RemoveNumbers(1)
}

function Add-SectionHeading {
  param(
    [object]$Selection,
    [string]$Code,
    [string]$Title
  )

  Add-Paragraph -Selection $Selection -Text $Code -FontSize 18 -Bold $true -Color 11393254 -SpaceAfter 0
  Add-Paragraph -Selection $Selection -Text $Title -FontSize 20 -Bold $true -Color 13027014 -SpaceAfter 12
}

function Add-SubHeading {
  param(
    [object]$Selection,
    [string]$Text
  )

  Add-Paragraph -Selection $Selection -Text $Text -FontSize 14 -Bold $true -Color 12632256 -SpaceAfter 8 -SpaceBefore 4
}

function Add-Body {
  param(
    [object]$Selection,
    [string[]]$Paragraphs
  )

  foreach ($paragraph in $Paragraphs) {
    Add-Paragraph -Selection $Selection -Text $paragraph -FontSize 11 -Alignment 3 -SpaceAfter 10
  }
}

function Add-StyledTable {
  param(
    [object]$Document,
    [object]$Selection,
    [string[]]$Headers,
    [object[][]]$Rows
  )

  $range = $Selection.Range
  $table = $Document.Tables.Add($range, $Rows.Count + 1, $Headers.Count)
  $table.Borders.Enable = 1
  $table.Range.Font.Name = "Calibri"
  $table.Range.Font.Size = 10
  $table.Rows.Alignment = 1
  $table.AllowAutoFit = $true

  for ($c = 1; $c -le $Headers.Count; $c++) {
    $table.Cell(1, $c).Range.Text = $Headers[$c - 1]
    $table.Cell(1, $c).Range.Font.Bold = 1
    $table.Cell(1, $c).Range.Font.Color = 16777215
    $table.Cell(1, $c).Shading.BackgroundPatternColor = 11393254
  }

  for ($r = 0; $r -lt $Rows.Count; $r++) {
    for ($c = 0; $c -lt $Headers.Count; $c++) {
      $table.Cell($r + 2, $c + 1).Range.Text = [string]$Rows[$r][$c]
      if ((($r + 2) % 2) -eq 0) {
        $table.Cell($r + 2, $c + 1).Shading.BackgroundPatternColor = 15921906
      } else {
        $table.Cell($r + 2, $c + 1).Shading.BackgroundPatternColor = 15395562
      }
    }
  }

  $Selection.MoveDown()
  $Selection.TypeParagraph()
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false

try {
  $document = $word.Documents.Add()
  $selection = $word.Selection
  $selection.Font.Name = "Calibri"

  $document.PageSetup.TopMargin = 50
  $document.PageSetup.BottomMargin = 50
  $document.PageSetup.LeftMargin = 55
  $document.PageSetup.RightMargin = 50

  Add-Paragraph -Selection $selection -Text "PROJECT REPORT" -FontSize 24 -Bold $true -Color 11393254 -Alignment 1 -SpaceAfter 6 -SpaceBefore 20
  Add-Paragraph -Selection $selection -Text "Optimized Retail Inventory Management System" -FontSize 28 -Bold $true -Color 13027014 -Alignment 1 -SpaceAfter 10
  Add-Paragraph -Selection $selection -Text "A Full-Stack Inventory, Procurement and Sales Analytics Platform" -FontSize 15 -Bold $false -Color 8404992 -Alignment 1 -SpaceAfter 20
  Add-Paragraph -Selection $selection -Text "Submitted in partial fulfilment of the requirements for the academic project documentation" -FontSize 12 -Alignment 1 -SpaceAfter 16
  Add-Paragraph -Selection $selection -Text "Prepared By: Jaidev Sankar" -FontSize 13 -Bold $true -Alignment 1 -SpaceAfter 4
  Add-Paragraph -Selection $selection -Text "Technology Stack: React, Vite, Node.js, Express, MySQL, Render, Vercel, Aiven" -FontSize 12 -Alignment 1 -SpaceAfter 4
  Add-Paragraph -Selection $selection -Text "Submission Date: April 2026" -FontSize 12 -Alignment 1 -SpaceAfter 60
  Add-Paragraph -Selection $selection -Text "This report presents the design, development, deployment, testing, and evaluation of a modern retail inventory solution that centralizes product management, category mapping, supplier data, stock movement tracking, sales and purchase transactions, alert generation, and actionable reporting." -FontSize 12 -Alignment 3 -SpaceAfter 14
  Add-Paragraph -Selection $selection -Text "The document is organised in a chapter-wise format similar to an academic final project portfolio, with detailed functional descriptions, system tables, implementation notes, deployment evidence, and analysis of real-world value." -FontSize 12 -Alignment 3 -SpaceAfter 14
  $selection.InsertBreak(7)

  Add-SectionHeading -Selection $selection -Code "CERTIFICATE" -Title "Project Completion Statement"
  Add-Body -Selection $selection -Paragraphs @(
    "This is to certify that the project entitled ""Optimized Retail Inventory Management System"" is a genuine record of software design, implementation, and deployment work carried out by the student as part of the academic project requirement. The project demonstrates the practical application of modern full-stack web engineering concepts including component-based user interfaces, REST API design, cloud deployment, relational data management, and operational analytics.",
    "The system was conceived to solve a realistic business problem: the difficulty of maintaining accurate stock information across products, categories, suppliers, purchases, and sales in a retail environment. By converting fragmented spreadsheet-style processes into a centralized digital platform, the project improves visibility, reduces manual error, and supports informed replenishment decisions.",
    "The work presented in this report includes the architecture, database design, implementation flow, interface design, business logic, integration approach, deployment workflow, and testing evidence. All major modules were designed, coded, refined, and validated in line with the project objective."
  )
  Add-Paragraph -Selection $selection -Text "Guide / Mentor Signature: ________________________" -FontSize 12 -SpaceAfter 14
  Add-Paragraph -Selection $selection -Text "Student Signature: ______________________________" -FontSize 12 -SpaceAfter 20
  $selection.InsertBreak(7)

  Add-SectionHeading -Selection $selection -Code "DECLARATION" -Title "Originality Statement"
  Add-Body -Selection $selection -Paragraphs @(
    "I hereby declare that the project report titled ""Optimized Retail Inventory Management System"" is an original work prepared and completed by me for academic submission. The software solution, report structure, implementation explanation, and supporting analysis included in this document have been compiled based on my project development process, technical learning, and deployment experience.",
    "Where external libraries, frameworks, or platforms were used, they have been acknowledged as part of the technical stack. The project incorporates standard software tools such as React, Vite, Node.js, Express, MySQL, and cloud deployment services, but the integration logic, dashboard arrangement, feature combinations, and operational workflow documented here represent the final form of this specific project implementation.",
    "I further declare that this report has been prepared to present the project in a professional format similar to a model reference document while preserving the actual content of my own system."
  )
  $selection.InsertBreak(7)

  Add-SectionHeading -Selection $selection -Code "ACKNOWLEDGEMENT" -Title "Acknowledgement"
  Add-Body -Selection $selection -Paragraphs @(
    "I would like to express my sincere gratitude to my faculty guide, mentors, and peers for their support and encouragement throughout the completion of this project. Their guidance helped me understand how to convert a practical inventory problem into a complete web-based application with measurable business value.",
    "I am equally thankful for the availability of modern development platforms and cloud services that enabled the project to move beyond local execution into an online, deployed system. The opportunity to work with real frontend deployment, backend hosting, database configuration, and production debugging significantly strengthened the practical relevance of this project.",
    "Finally, I acknowledge the iterative nature of this work. From database connection issues to role-based access decisions and responsive design improvements, the project evolved through repeated testing and refinement. That process has been essential in shaping the final version documented in this report."
  )
  $selection.InsertBreak(7)

  Add-SectionHeading -Selection $selection -Code "ABSTRACT" -Title "Project Abstract"
  Add-Body -Selection $selection -Paragraphs @(
    "The Optimized Retail Inventory Management System is a full-stack web application developed to digitize and simplify inventory operations in a retail context. The system combines a React-based frontend dashboard with a Node.js and Express backend, connected to a MySQL database. It enables secure user authentication, product and supplier management, stock quantity updates, purchase and sales recording, alert generation, and operational analytics.",
    "The core motivation behind the project is the inefficiency of manual inventory handling. Traditional methods often depend on disconnected sheets or static records, resulting in stock mismatch, poor replenishment visibility, and delayed operational decisions. This project addresses those challenges by creating a centralized platform that continuously reflects inventory movement and supports business monitoring through interactive modules.",
    "The application includes separate roles for administrator and staff users, where administrators can manage categories, suppliers, products, and transactional updates, while staff members can access controlled operational views. The system also generates stock-health indicators such as low stock, healthy stock, and overstock labels. It highlights reorder quantities using recent movement information to support restocking decisions.",
    "The frontend was designed with a premium dark dashboard aesthetic to ensure modern usability on desktop and mobile devices. The backend exposes RESTful inventory routes and validates business rules such as SKU uniqueness, supplier existence, category linkage, and transaction-driven stock updates. The database schema organizes users, categories, suppliers, products, purchases, and sales through normalized relationships. The final system was successfully deployed online using Render for the backend, Vercel for the frontend, and Aiven MySQL for the cloud database layer.",
    "This report presents the project in a chapter-wise structure, documenting its objectives, architecture, implementation details, database design, modules, testing, deployment, limitations, and future scope."
  )
  $selection.InsertBreak(7)

  Add-SectionHeading -Selection $selection -Code "TABLE OF CONTENTS" -Title "Contents Overview"
  Add-BulletList -Selection $selection -Items @(
    "Chapter 1 - Introduction",
    "Chapter 2 - Problem Statement and Objectives",
    "Chapter 3 - Existing System and Proposed System",
    "Chapter 4 - Requirement Analysis",
    "Chapter 5 - System Architecture and Design",
    "Chapter 6 - Database Design",
    "Chapter 7 - Frontend Design and User Experience",
    "Chapter 8 - Backend API and Business Logic",
    "Chapter 9 - Implementation Modules",
    "Chapter 10 - Deployment and Environment Configuration",
    "Chapter 11 - Testing Strategy and Outcomes",
    "Chapter 12 - Security, Performance and Maintainability",
    "Chapter 13 - Results and Business Impact",
    "Chapter 14 - Limitations and Future Enhancements",
    "Chapter 15 - Conclusion, References and Appendices"
  )
  $selection.InsertBreak(7)

  Add-SectionHeading -Selection $selection -Code "01" -Title "INTRODUCTION"
  Add-Body -Selection $selection -Paragraphs @(
    "Retail inventory control is one of the most critical operational domains in commerce. Whether the business is small or large, its ability to understand current stock levels, plan reorders, maintain supplier relationships, and process purchases and sales accurately has a direct impact on profitability and customer satisfaction. When stock data becomes inaccurate, the business faces both stockouts and overstock situations, each of which increases cost.",
    "The Optimized Retail Inventory Management System was created as a practical answer to this challenge. The project translates inventory management into a unified digital workflow, where all major entities—users, categories, suppliers, products, purchases, and sales—are connected through one application. Instead of relying on manual updates in multiple files, the system reflects stock movement immediately through business logic implemented in the backend.",
    "The project is also significant from a software engineering perspective because it demonstrates end-to-end development. The user interface was built using React and Vite to provide responsive component-driven experiences. The backend uses Express and MySQL2 to expose API endpoints and persist data in a normalized relational schema. Deployment on public cloud platforms ensures the application is not only a prototype but a working online system.",
    "Another important dimension of this project is its role-based access design. By distinguishing between administrator and staff users, the system mirrors real business operations where not every user should control master data and stock transactions. This supports safer operations and clearer responsibility boundaries.",
    "The following chapters examine the project from technical, analytical, and practical viewpoints so that the report functions both as academic documentation and as a portfolio-grade presentation of the final system."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Attribute","Description") -Rows @(
    @("Project Name","Optimized Retail Inventory Management System"),
    @("Project Category","Full-Stack Web Application"),
    @("Domain","Retail Operations / Inventory Control"),
    @("Primary Users","Administrator, Staff"),
    @("Core Objective","Digitize and optimize inventory workflows"),
    @("Deployment Status","Frontend and backend deployed online")
  )

  Add-SectionHeading -Selection $selection -Code "02" -Title "PROBLEM STATEMENT AND OBJECTIVES"
  Add-SubHeading -Selection $selection -Text "2.1 Problem Statement"
  Add-Body -Selection $selection -Paragraphs @(
    "In many retail contexts, inventory records are updated manually and often inconsistently. Product entries may be duplicated, SKU references may not be standardized, purchase entries may not immediately reflect in stock totals, and sales deductions may not be visible to the wider team in real time. This leads to weak decision-making and operational confusion.",
    "Without a centralized system, it becomes difficult to answer basic business questions such as which products are below minimum stock, which suppliers are associated with high-demand items, how recent purchases have affected stock levels, and what reorder quantity should be planned next. Managers are then forced to rely on assumptions instead of evidence."
  )
  Add-SubHeading -Selection $selection -Text "2.2 Objectives"
  Add-BulletList -Selection $selection -Items @(
    "To build a responsive web-based inventory dashboard for retail operations.",
    "To provide authentication-based access for administrator and staff users.",
    "To create normalized storage for users, categories, suppliers, products, purchases, and sales.",
    "To support product creation, supplier creation, category definition, and quantity editing.",
    "To automatically update stock totals when purchases and sales are recorded.",
    "To display alerts and insights such as low stock, healthy stock, overstock, and reorder suggestions.",
    "To deploy the system online using modern frontend, backend, and database hosting services."
  )
  Add-SubHeading -Selection $selection -Text "2.3 Scope of the Project"
  Add-Body -Selection $selection -Paragraphs @(
    "The scope of the project includes web-based inventory monitoring, master-data management, stock movement recording, and dashboard reporting. It does not attempt to cover billing, payments, multi-branch warehousing, barcode scanning, or ERP-scale integrations. This bounded scope keeps the solution realistic for academic implementation while still delivering real operational utility.",
    "The project is intentionally modular, which means it can be extended later into billing, vendor scoring, demand forecasting, or multi-branch analytics without redesigning the core structure."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Objective ID","Objective","Outcome Delivered") -Rows @(
    @("OBJ-01","Centralize stock information","Implemented via bootstrap dashboard endpoint"),
    @("OBJ-02","Enable product and supplier management","Admin panels support create and view workflows"),
    @("OBJ-03","Track stock movement","Purchases and sales update product quantity"),
    @("OBJ-04","Support decision-making","Alerts, stats and reorder metrics included"),
    @("OBJ-05","Demonstrate deployable engineering","Rendered frontend/backend/database stack deployed")
  )

  Add-SectionHeading -Selection $selection -Code "03" -Title "EXISTING SYSTEM AND PROPOSED SYSTEM"
  Add-SubHeading -Selection $selection -Text "3.1 Existing Manual or Semi-Manual Approach"
  Add-Body -Selection $selection -Paragraphs @(
    "The typical existing method in smaller retail setups consists of spreadsheets, handwritten logs, or simple point-based tracking that is disconnected from supplier and sales information. Data entries are often repeated and delayed. If a purchase is received, the product stock may be updated in one sheet but not reflected in reporting. Similarly, product availability may be assumed without verifying transaction history.",
    "Such systems are easy to begin with but difficult to scale. Their weaknesses include duplication, lack of access control, slow reporting, human error, and absence of automated stock insights."
  )
  Add-SubHeading -Selection $selection -Text "3.2 Proposed System"
  Add-Body -Selection $selection -Paragraphs @(
    "The proposed system replaces fragmented record keeping with a centralized, role-aware digital application. All inventory data is stored in MySQL and accessed through validated backend APIs. The dashboard provides one place to manage categories, suppliers, products, quantity edits, purchases, sales, stock health, and reports.",
    "The proposed system is superior because it integrates master data and transactions. Purchases increase stock, sales reduce stock, and the resulting product state immediately influences dashboard analytics. This makes the application operationally meaningful rather than just presentational."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Parameter","Existing Approach","Proposed System") -Rows @(
    @("Data Management","Manual sheets and repeated entries","Centralized relational database"),
    @("Accuracy","Prone to mismatch and duplication","Validated create/update transaction flow"),
    @("Access Control","Minimal or absent","Role-aware login and dashboard views"),
    @("Reporting","Manual calculations","Real-time dashboard stats and insights"),
    @("Scalability","Low","Moderate and extendable"),
    @("Cloud Readiness","Not available","Deployed and accessible online")
  )

  Add-SectionHeading -Selection $selection -Code "04" -Title "REQUIREMENT ANALYSIS"
  Add-SubHeading -Selection $selection -Text "4.1 Functional Requirements"
  Add-BulletList -Selection $selection -Items @(
    "The system shall allow users to register and log in using email and password.",
    "The system shall authenticate administrator and staff roles separately.",
    "The system shall allow administrators to create categories, suppliers, and products.",
    "The system shall record purchase entries and increase stock automatically.",
    "The system shall record sales entries and decrease stock automatically.",
    "The system shall allow quantity edits with validation for whole numbers.",
    "The system shall show alerts, top-selling indicators, and reorder suggestions.",
    "The system shall prevent duplicate SKU and duplicate supplier email creation.",
    "The system shall prevent deletion of products with purchase or sales history."
  )
  Add-SubHeading -Selection $selection -Text "4.2 Non-Functional Requirements"
  Add-BulletList -Selection $selection -Items @(
    "Responsive layout across desktop and mobile devices.",
    "Readable and modern user interface for business users.",
    "Stable API behavior with clear error messages.",
    "Maintainable modular codebase on both frontend and backend.",
    "Cloud deployment compatibility for frontend, backend, and database.",
    "Secure storage of credentials through environment variables.",
    "Consistent database integrity through foreign key constraints."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Requirement Type","Requirement Detail","Implemented In") -Rows @(
    @("Functional","Authentication and role return","authController.js"),
    @("Functional","Inventory bootstrap dataset","inventoryController.js"),
    @("Functional","Purchase and sale transaction logic","store.js transactional methods"),
    @("Functional","Product quantity editing","PATCH /products/:id/quantity"),
    @("Non-Functional","Responsive UI","app.css and component layout"),
    @("Non-Functional","Cloud deployment","Render, Vercel, Aiven configuration")
  )

  Add-SectionHeading -Selection $selection -Code "05" -Title "SYSTEM ARCHITECTURE AND DESIGN"
  Add-Body -Selection $selection -Paragraphs @(
    "The architecture follows a three-tier model. The presentation tier consists of the React frontend, which renders the login screen, dashboard cards, forms, tables, alerts, and reporting panels. The application tier consists of the Node.js and Express backend, which exposes REST endpoints and validates business logic. The data tier consists of a MySQL database deployed on Aiven, which stores master records and transaction history.",
    "The frontend communicates with the backend through fetch-based API calls. The backend exposes inventory and authentication routes. It connects to MySQL using the mysql2 driver and uses transaction-safe operations for purchase, sale, quantity update, and delete processes where data consistency matters. This separation of concerns results in a maintainable codebase where each layer can evolve without tightly coupling every change."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Layer","Technology","Key Responsibility") -Rows @(
    @("Presentation Layer","React + Vite","Dashboard rendering, forms, state handling"),
    @("API Layer","Node.js + Express","Routing, validation, controller execution"),
    @("Persistence Layer","MySQL + mysql2","Relational storage and query execution"),
    @("Hosting Layer","Render / Vercel / Aiven","Production deployment and availability")
  )

  Add-SubHeading -Selection $selection -Text "5.1 Data Flow Summary"
  Add-BulletList -Selection $selection -Items @(
    "User logs in from frontend form.",
    "Frontend sends credentials to authentication endpoint.",
    "Backend verifies user against MySQL records.",
    "Frontend loads bootstrap inventory data after successful login.",
    "Admin actions create or modify inventory records through POST/PATCH/DELETE calls.",
    "Backend updates MySQL and returns success or validation errors.",
    "Frontend refreshes dashboard state and shows updated business metrics."
  )

  Add-SectionHeading -Selection $selection -Code "06" -Title "DATABASE DESIGN"
  Add-Body -Selection $selection -Paragraphs @(
    "The database schema is normalized to reduce redundancy and maintain consistent relationships. The users table stores authentication identity and role information. Categories and suppliers represent master entities. Products depend on both category and supplier references. Purchases and sales capture stock movement using product linkage, while purchases additionally reference suppliers. This schema ensures a clear separation between master data and transaction history.",
    "Foreign key constraints are used in the products, purchases, and sales tables. This helps preserve referential integrity. The schema also includes uniqueness rules such as unique user email, unique supplier email, unique category name, and unique SKU. Together these design choices reduce duplication and protect the quality of operational data."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Table","Primary Purpose","Important Fields") -Rows @(
    @("users","Store login users and roles","id, name, email, password_hash, role"),
    @("categories","Group products by type","id, name"),
    @("suppliers","Store supplier master information","id, name, contact_person, phone, email, location"),
    @("products","Store item-level stock records","id, name, sku, category_id, supplier_id, quantity"),
    @("purchases","Record incoming stock","id, product_id, supplier_id, quantity, unit_cost, date"),
    @("sales","Record outgoing stock","id, product_id, quantity, unit_price, date")
  )

  Add-SubHeading -Selection $selection -Text "6.1 Relationship Interpretation"
  Add-Body -Selection $selection -Paragraphs @(
    "One category can be linked to multiple products. One supplier can also be linked to multiple products and purchase records. One product can appear in multiple purchase transactions and multiple sale transactions. This gives the system enough structure to compute both current stock and activity history.",
    "The schema is intentionally simple enough for academic implementation yet robust enough for realistic business use. It forms the foundation for all dashboard computations."
  )

  Add-SectionHeading -Selection $selection -Code "07" -Title "FRONTEND DESIGN AND USER EXPERIENCE"
  Add-Body -Selection $selection -Paragraphs @(
    "The frontend was developed using React 19 with Vite as the development and build tool. The interface uses modular components to keep concerns separated. Key components include the login screen, stat cards, alerts panel, categories panel, suppliers panel, products panel, transactions panel, reports panel, and insights panel.",
    "The visual design evolved significantly during development. The final theme uses a premium dark palette with subdued metallic highlights, a glass-panel aesthetic, bold headings, responsive forms, and mobile-friendly adjustments. The layout emphasizes readability while still presenting the application as a polished portfolio piece."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Frontend Component","Purpose","User Impact") -Rows @(
    @("LoginScreen","Handles authentication forms","Provides secure entry into the system"),
    @("StatCards","Displays key metrics","Gives immediate operational snapshot"),
    @("AlertsPanel","Shows stock warnings","Draws attention to urgent stock issues"),
    @("ProductsPanel","Handles product listing and creation","Central area for inventory control"),
    @("TransactionsPanel","Handles purchases and sales","Captures movement of stock"),
    @("ReportsPanel","Displays summary analytics","Supports decision-making"),
    @("InsightsPanel","Shows top-performing or trend insights","Adds business intelligence context")
  )

  Add-SubHeading -Selection $selection -Text "7.1 Mobile Responsiveness"
  Add-Body -Selection $selection -Paragraphs @(
    "The application stylesheet includes specific media-query adjustments for screens below 720 pixels. On mobile devices, grid sections collapse into single-column layouts, buttons expand to full width where necessary, and the table container remains horizontally scrollable instead of breaking structure. This preserves function while improving usability on smaller screens."
  )

  Add-SectionHeading -Selection $selection -Code "08" -Title "BACKEND API AND BUSINESS LOGIC"
  Add-Body -Selection $selection -Paragraphs @(
    "The backend uses Express for routing and controller orchestration. It defines authentication routes and inventory routes. Authentication handles login and registration, while inventory routes handle bootstrap data retrieval, category creation, supplier creation, product creation, purchase recording, sale recording, quantity updates, and product deletion.",
    "The controller layer performs validation before touching the database. Numeric fields are parsed and checked. Required text fields are normalized and verified. Business rules such as SKU uniqueness, supplier existence, category existence, stock sufficiency for sales, and quantity non-negativity are enforced before writes are committed."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Route","Method","Purpose") -Rows @(
    @("/api/auth/login","POST","Authenticate user credentials"),
    @("/api/auth/register","POST","Create a new staff account"),
    @("/api/inventory/bootstrap","GET","Load dashboard dataset"),
    @("/api/inventory/categories","POST","Create category"),
    @("/api/inventory/suppliers","POST","Create supplier"),
    @("/api/inventory/products","POST","Create product"),
    @("/api/inventory/products/:id/quantity","PATCH","Update product quantity"),
    @("/api/inventory/products/:id","DELETE","Delete product if no history exists"),
    @("/api/inventory/purchases","POST","Record purchase and increase stock"),
    @("/api/inventory/sales","POST","Record sale and decrease stock")
  )

  Add-SubHeading -Selection $selection -Text "8.1 Transaction Logic"
  Add-Body -Selection $selection -Paragraphs @(
    "The store layer uses database transactions for operations where consistency must be preserved. For example, when a purchase is recorded, the system inserts a purchase row and increases product quantity in the same transaction. Likewise, when a sale is recorded, the backend checks stock sufficiency, inserts the sale row, and decreases product quantity atomically.",
    "Product deletion is intentionally restricted. If a product already has purchase or sales history, the deletion is blocked. This protects historical reporting from accidental data loss."
  )

  Add-SectionHeading -Selection $selection -Code "09" -Title "IMPLEMENTATION MODULES"
  Add-SubHeading -Selection $selection -Text "9.1 Authentication Module"
  Add-Body -Selection $selection -Paragraphs @(
    "The authentication module verifies email and password combinations using stored hashed passwords. It returns a user object containing name, email, role, and a token-like string for session simulation. Although the token flow is simplified for academic use, the module is structured clearly enough to be upgraded later to JWT-based authentication.",
    "Registration creates staff users by default. This reflects a practical access-control assumption where new users do not automatically obtain administrator privileges."
  )
  Add-SubHeading -Selection $selection -Text "9.2 Master Data Module"
  Add-Body -Selection $selection -Paragraphs @(
    "The master data module handles categories, suppliers, and products. Category creation ensures uniqueness by name. Supplier creation ensures uniqueness by email. Product creation validates SKU uniqueness and ensures related category and supplier records already exist. These checks prevent orphaned or inconsistent inventory records."
  )
  Add-SubHeading -Selection $selection -Text "9.3 Inventory Movement Module"
  Add-Body -Selection $selection -Paragraphs @(
    "This module processes purchases and sales and keeps stock quantities synchronized. It is the operational heart of the system because it translates business events into database changes. Purchases increase stock, while sales decrease it. Quantity editing is also supported when administrative correction is required."
  )
  Add-SubHeading -Selection $selection -Text "9.4 Dashboard and Reporting Module"
  Add-Body -Selection $selection -Paragraphs @(
    "The dashboard combines product data, transaction history, alerts, stock states, and movement-based calculations into a single visual environment. It surfaces statistics, top-selling items, reorder suggestions, and trend-like summaries that help users understand not only what the stock level is, but what action should be taken next."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Module","Key Functions","Value Added") -Rows @(
    @("Authentication","Login, register, role return","Secure system access"),
    @("Master Data","Create category/supplier/product","Organized inventory structure"),
    @("Inventory Movement","Purchases, sales, quantity update","Stock accuracy"),
    @("Dashboard","Stats, alerts, insights","Business visibility"),
    @("Deployment","Cloud hosting setup","Practical usability and accessibility")
  )

  Add-SectionHeading -Selection $selection -Code "10" -Title "DEPLOYMENT AND ENVIRONMENT CONFIGURATION"
  Add-Body -Selection $selection -Paragraphs @(
    "A major strength of the project is that it was not left as a local-only prototype. The frontend was deployed using Vercel, the backend using Render, and the database using Aiven MySQL. The deployment process required practical configuration of environment variables, CORS handling, database host setup, SSL considerations, and route integration between frontend and backend layers.",
    "This stage also exposed real-world debugging situations including invalid database hostnames, incorrect credentials, schema import issues, and frontend API base URL mismatches. Solving these problems was part of the project’s practical learning outcome."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Platform","Used For","Important Configuration") -Rows @(
    @("Vercel","Frontend hosting","VITE_API_BASE_URL"),
    @("Render","Backend hosting","PORT, FRONTEND_URL, DB_* variables"),
    @("Aiven","Cloud MySQL database","Host, port, SSL mode, DB name"),
    @("GitHub","Source control and deployment source","Repository integration")
  )

  Add-SubHeading -Selection $selection -Text "10.1 Environment Variables"
  Add-Body -Selection $selection -Paragraphs @(
    "The backend environment requires variables such as PORT, FRONTEND_URL, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, and DB_SSL_MODE. The frontend environment requires VITE_API_BASE_URL to target the deployed backend API. These environment-level integrations are essential to move the system from local testing to production execution."
  )

  Add-SectionHeading -Selection $selection -Code "11" -Title "TESTING STRATEGY AND OUTCOMES"
  Add-Body -Selection $selection -Paragraphs @(
    "Testing was conducted through both functional verification and deployment validation. Functional testing covered login, registration, category creation, supplier creation, product creation, quantity updates, purchase recording, sales recording, and delete behavior. Deployment validation focused on API routing, environment configuration, MySQL connectivity, and frontend-backend communication in production.",
    "The testing process also demonstrated the importance of error interpretation. Messages such as ECONNREFUSED, ENOTFOUND, Access denied, incorrect database name, and schema missing each pointed to a different type of issue. Resolving them improved both the software and the developer’s understanding of modern cloud deployment behavior."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Test Case","Expected Result","Observed Result","Status") -Rows @(
    @("Admin login","Full dashboard loads","Successful","Pass"),
    @("Staff login","Limited dashboard loads","Successful","Pass"),
    @("Create category","Category saved","Successful","Pass"),
    @("Create supplier","Supplier saved if email unique","Successful","Pass"),
    @("Create product","Product saved if SKU unique","Successful after form alignment fix","Pass"),
    @("Record purchase","Purchase saved and stock increases","Successful","Pass"),
    @("Record sale","Sale saved and stock decreases","Successful","Pass"),
    @("Delete product with history","Delete blocked","Successful business-rule enforcement","Pass"),
    @("Production API access","Frontend reaches backend","Successful after env configuration","Pass")
  )

  Add-SectionHeading -Selection $selection -Code "12" -Title "SECURITY, PERFORMANCE AND MAINTAINABILITY"
  Add-Body -Selection $selection -Paragraphs @(
    "From a security standpoint, the project uses hashed passwords, role-based behavior, and environment variables for deployment secrets. Although it does not yet implement enterprise-grade authentication flows such as JWT refresh tokens or CSRF protection, it establishes a clear foundation for those upgrades.",
    "Performance is supported through a lightweight technology stack and server-side query logic. The dashboard bootstrap approach reduces multiple client round-trips by returning a composed dataset. The UI remains responsive because React components focus on rendering modular data rather than repeatedly requesting small fragments.",
    "Maintainability is strengthened through modular source files. Controllers, routes, data access utilities, component files, and style sheets are separated logically. This makes the system easier to extend and debug."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Quality Factor","Current Implementation","Improvement Potential") -Rows @(
    @("Security","Password hashing and role distinction","JWT, session expiry, password reset"),
    @("Performance","Compact stack and aggregated bootstrap load","Caching and query optimization"),
    @("Maintainability","Modular controllers/components","Type checking and unit testing"),
    @("Reliability","Transactional stock updates","Retry logic and logging dashboards")
  )

  Add-SectionHeading -Selection $selection -Code "13" -Title "RESULTS AND BUSINESS IMPACT"
  Add-Body -Selection $selection -Paragraphs @(
    "The final result is a working inventory management application that supports realistic business workflows and is accessible online. It provides immediate operational value by combining visibility, control, and reporting in one place. Administrators can maintain core inventory entities, while staff can still access a focused operational interface.",
    "From a business perspective, the system reduces manual effort, increases transparency, and helps avoid two common inventory failures: understocking and overstocking. Since stock levels are tied to transactions, the dashboard can present more meaningful insights than a static spreadsheet. This allows users to move from record keeping toward decision support."
  )

  Add-StyledTable -Document $document -Selection $selection -Headers @("Business Area","Before System","After System") -Rows @(
    @("Stock Visibility","Fragmented and delayed","Centralized and updated through transactions"),
    @("Supplier Reference","Manual and scattered","Structured supplier records"),
    @("Product Control","Duplicate-prone and unclear","SKU-based validated records"),
    @("Decision Support","Minimal","Alerts, stats, reorder suggestions"),
    @("Accessibility","Local/manual use only","Cloud-deployed web access")
  )

  Add-SectionHeading -Selection $selection -Code "14" -Title "LIMITATIONS AND FUTURE ENHANCEMENTS"
  Add-Body -Selection $selection -Paragraphs @(
    "The current version is strong as an academic and portfolio project, but it still has natural limitations. Authentication is simplified, report export features are minimal, and there is no advanced vendor analytics or forecasting engine. The product delete rule is conservative and does not yet support archival behavior. Multi-branch inventory and invoice workflows are also outside the current scope.",
    "Future enhancements could include barcode integration, PDF invoice generation, CSV import/export, branch-wise stock views, dashboard charts with richer time-series analysis, demand forecasting using historical sales patterns, and role permissions that go beyond a simple admin/staff split."
  )
  Add-BulletList -Selection $selection -Items @(
    "Add JWT authentication and protected route persistence.",
    "Introduce chart visualizations for sales and purchase trends.",
    "Implement archival instead of hard deletion for products.",
    "Support branch-level inventory and location tracking.",
    "Add supplier performance scores and procurement summaries.",
    "Enable report export to PDF and spreadsheet formats.",
    "Integrate search, sort, and pagination for large datasets."
  )

  Add-SectionHeading -Selection $selection -Code "15" -Title "CONCLUSION"
  Add-Body -Selection $selection -Paragraphs @(
    "The Optimized Retail Inventory Management System successfully meets its project objective of creating a practical, data-driven web application for inventory operations. It demonstrates how a full-stack solution can connect authentication, database normalization, business-rule enforcement, responsive UI design, and real cloud deployment into one coherent system.",
    "The project is valuable not only because it functions, but because it reflects the full lifecycle of modern application development: planning, design, coding, debugging, deployment, refinement, and documentation. The finished platform is capable of supporting realistic inventory workflows and provides a strong foundation for future expansion.",
    "As a final academic submission, this project proves both technical competence and applied problem-solving ability. It shows how software can convert day-to-day retail challenges into structured, measurable, and actionable digital processes."
  )

  Add-SectionHeading -Selection $selection -Code "REFERENCES" -Title "Reference Sources"
  Add-BulletList -Selection $selection -Items @(
    "React official documentation",
    "Vite official documentation",
    "Express official documentation",
    "MySQL documentation",
    "mysql2 package documentation",
    "Render deployment documentation",
    "Vercel deployment documentation",
    "Aiven MySQL connection documentation"
  )

  Add-SectionHeading -Selection $selection -Code "APPENDIX" -Title "Supplementary Technical Notes"
  Add-SubHeading -Selection $selection -Text "Appendix A - Technology Stack Summary"
  Add-StyledTable -Document $document -Selection $selection -Headers @("Technology","Version / Use") -Rows @(
    @("React","Frontend UI library"),
    @("Vite","Frontend dev/build tool"),
    @("Node.js","Runtime for backend"),
    @("Express","Backend routing framework"),
    @("MySQL","Relational database"),
    @("mysql2","Database driver"),
    @("Render","Backend host"),
    @("Vercel","Frontend host"),
    @("Aiven","Managed cloud MySQL")
  )
  Add-SubHeading -Selection $selection -Text "Appendix B - Key Database Tables"
  Add-Body -Selection $selection -Paragraphs @(
    "The schema includes six major tables: users, categories, suppliers, products, purchases, and sales. Their relationships were designed to support both current state and transaction history. This appendix section records the most important design assumptions that shaped stock behavior in the system.",
    "Products depend on categories and suppliers. Purchases and sales depend on products. Deletion is blocked where transaction history exists. Quantity changes are validated as whole-number updates to avoid accidental decimal stock."
  )
  Add-SubHeading -Selection $selection -Text "Appendix C - Deployment Learning Summary"
  Add-Body -Selection $selection -Paragraphs @(
    "Cloud deployment required careful alignment of environment variables, database hostnames, SSL mode, API base URLs, and schema availability. This practical work is an important part of the project because it transformed the application from local code into a real online system.",
    "The report therefore documents not only the ideal architecture, but also the actual implementation path and troubleshooting lessons learned during deployment."
  )

  $document.SaveAs([ref]$outputPath, [ref]16)
  $document.Close()
  $word.Quit()
} catch {
  if ($document) { $document.Close([ref]0) }
  if ($word) { $word.Quit() }
  throw
}
