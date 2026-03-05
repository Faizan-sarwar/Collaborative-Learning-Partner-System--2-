const QUESTION_BANK = [
  {
    id: 1,
    question: "Which of the following is a JavaScript framework for building user interfaces?",
    options: ["Laravel", "Django", "React", "Ruby on Rails"],
    answer: "React",
    category: "Web Development"
  },
  {
    id: 2,
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Control Style Sheets"],
    answer: "Cascading Style Sheets",
    category: "Web Development"
  },
  {
    id: 3,
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    answer: "<a>",
    category: "Web Development"
  },
  {
    id: 4,
    question: "Which language is used to structure web pages?",
    options: ["CSS", "JavaScript", "HTML", "PHP"],
    answer: "HTML",
    category: "Web Development"
  },
  {
    id: 5,
    question: "Which HTTP method is used to retrieve data?",
    options: ["POST", "PUT", "DELETE", "GET"],
    answer: "GET",
    category: "Web Development"
  },
  {
    id: 6,
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Data Object Model", "Document Oriented Method", "Digital Object Manager"],
    answer: "Document Object Model",
    category: "Web Development"
  },
  {
    id: 7,
    question: "Which CSS property is used to change text color?",
    options: ["font-style", "text-color", "color", "background-color"],
    answer: "color",
    category: "Web Development"
  },
  {
    id: 8,
    question: "Which tag is used for inserting an image in HTML?",
    options: ["<img>", "<image>", "<pic>", "<src>"],
    answer: "<img>",
    category: "Web Development"
  },
  {
    id: 9,
    question: "Which JavaScript keyword is used to declare a constant?",
    options: ["var", "let", "const", "static"],
    answer: "const",
    category: "Web Development"
  },
  {
    id: 10,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Applied Program Internet", "Application Process Integration", "Advanced Programming Interface"],
    answer: "Application Programming Interface",
    category: "Web Development"
  },
  {
    id: 11,
    question: "Which CSS layout model uses rows and columns?",
    options: ["Flexbox", "Grid", "Float", "Position"],
    answer: "Grid",
    category: "Web Development"
  },
  {
    id: 12,
    question: "Which HTML attribute is used to provide alternative text for images?",
    options: ["title", "src", "alt", "href"],
    answer: "alt",
    category: "Web Development"
  },
  {
    id: 13,
    question: "Which JavaScript function converts JSON to an object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.convert()"],
    answer: "JSON.parse()",
    category: "Web Development"
  },
  {
    id: 14,
    question: "Which port does HTTP use by default?",
    options: ["21", "25", "80", "443"],
    answer: "80",
    category: "Web Development"
  },
  {
    id: 15,
    question: "Which technology is used for server-side scripting?",
    options: ["HTML", "CSS", "JavaScript", "PHP"],
    answer: "PHP",
    category: "Web Development"
  },
  {
    id: 16,
    question: "What does URL stand for?",
    options: ["Universal Resource Locator", "Uniform Resource Locator", "Unified Resource Link", "Universal Resource Link"],
    answer: "Uniform Resource Locator",
    category: "Web Development"
  },
  {
    id: 17,
    question: "Which HTML tag is used to define a table row?",
    options: ["<td>", "<tr>", "<th>", "<table>"],
    answer: "<tr>",
    category: "Web Development"
  },
  {
    id: 18,
    question: "Which JavaScript method is used to select an element by ID?",
    options: ["getElement()", "querySelectorAll()", "getElementById()", "selectById()"],
    answer: "getElementById()",
    category: "Web Development"
  },
  {
    id: 19,
    question: "Which CSS property controls the space inside an element?",
    options: ["margin", "border", "padding", "spacing"],
    answer: "padding",
    category: "Web Development"
  },
  {
    id: 20,
    question: "Which protocol is used for secure web communication?",
    options: ["HTTP", "FTP", "SMTP", "HTTPS"],
    answer: "HTTPS",
    category: "Web Development"
  },
  {
    id: 21,
    question: "Which JavaScript operator is used for strict equality?",
    options: ["==", "=", "===", "!="],
    answer: "===",
    category: "Web Development"
  },
  {
    id: 22,
    question: "Which HTML tag is used to create an unordered list?",
    options: ["<ol>", "<ul>", "<li>", "<list>"],
    answer: "<ul>",
    category: "Web Development"
  },
  {
    id: 23,
    question: "Which tool is commonly used for version control?",
    options: ["Docker", "Git", "NPM", "Webpack"],
    answer: "Git",
    category: "Web Development"
  },
  {
    id: 24,
    question: "What does SEO stand for?",
    options: ["Search Engine Optimization", "System Engine Operation", "Search Easy Option", "Site Engine Output"],
    answer: "Search Engine Optimization",
    category: "Web Development"
  },
  {
    id: 25,
    question: "Which JavaScript array method adds an element to the end?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()",
    category: "Web Development"
  },
  {
    id: 26,
    question: "Which HTML element is used for semantic navigation?",
    options: ["<div>", "<span>", "<nav>", "<section>"],
    answer: "<nav>",
    category: "Web Development"
  },
  {
    id: 27,
    question: "Which CSS property is used to make text bold?",
    options: ["font-style", "font-weight", "text-bold", "style"],
    answer: "font-weight",
    category: "Web Development"
  },
  {
    id: 28,
    question: "Which JavaScript keyword is used to define a function?",
    options: ["method", "function", "define", "func"],
    answer: "function",
    category: "Web Development"
  },
  {
    id: 29,
    question: "Which file extension is used for JavaScript files?",
    options: [".js", ".java", ".jsx", ".script"],
    answer: ".js",
    category: "Web Development"
  },
  {
    id: 30,
    question: "Which HTML tag is used to define the document type?",
    options: ["<meta>", "<doctype>", "<!DOCTYPE>", "<html>"],
    answer: "<!DOCTYPE>",
    category: "Web Development"
  },
  {
    id: 31,
    question: "Which CSS property controls element positioning?",
    options: ["display", "float", "position", "align"],
    answer: "position",
    category: "Web Development"
  },
  {
    id: 32,
    question: "Which JavaScript loop is guaranteed to run at least once?",
    options: ["for", "while", "do...while", "foreach"],
    answer: "do...while",
    category: "Web Development"
  },
  {
    id: 33,
    question: "Which tag is used to embed a video?",
    options: ["<media>", "<video>", "<movie>", "<embed>"],
    answer: "<video>",
    category: "Web Development"
  },
  {
    id: 34,
    question: "Which HTTP status code means 'Not Found'?",
    options: ["200", "301", "404", "500"],
    answer: "404",
    category: "Web Development"
  },
  {
    id: 35,
    question: "Which JavaScript method removes the last array element?",
    options: ["pop()", "push()", "shift()", "splice()"],
    answer: "pop()",
    category: "Web Development"
  },
  {
    id: 36,
    question: "Which CSS unit is relative to the parent element?",
    options: ["px", "em", "cm", "mm"],
    answer: "em",
    category: "Web Development"
  },
  {
    id: 37,
    question: "Which HTML element represents the footer?",
    options: ["<bottom>", "<footer>", "<end>", "<section>"],
    answer: "<footer>",
    category: "Web Development"
  },
  {
    id: 38,
    question: "Which JavaScript method converts an object to JSON?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.encode()", "JSON.convert()"],
    answer: "JSON.stringify()",
    category: "Web Development"
  },
  {
    id: 39,
    question: "Which CSS property hides an element but keeps its space?",
    options: ["display: none", "opacity: 0", "visibility: hidden", "hidden"],
    answer: "visibility: hidden",
    category: "Web Development"
  },
  {
    id: 40,
    question: "Which tag is used to include JavaScript in HTML?",
    options: ["<js>", "<javascript>", "<script>", "<code>"],
    answer: "<script>",
    category: "Web Development"
  },
  {
    id: 41,
    question: "Which database is commonly used with web applications?",
    options: ["MySQL", "Excel", "Notepad", "Paint"],
    answer: "MySQL",
    category: "Web Development"
  },
  {
    id: 42,
    question: "Which CSS property changes background color?",
    options: ["color", "background", "background-color", "bgcolor"],
    answer: "background-color",
    category: "Web Development"
  },
  {
    id: 43,
    question: "Which JavaScript keyword stops a loop?",
    options: ["stop", "exit", "break", "end"],
    answer: "break",
    category: "Web Development"
  },
  {
    id: 44,
    question: "Which HTML tag is used to create a form?",
    options: ["<input>", "<form>", "<fieldset>", "<submit>"],
    answer: "<form>",
    category: "Web Development"
  },
  {
    id: 45,
    question: "Which CSS property is used to create rounded corners?",
    options: ["corner-radius", "round", "border-radius", "edge-radius"],
    answer: "border-radius",
    category: "Web Development"
  },
  {
    id: 46,
    question: "Which JavaScript event occurs when a button is clicked?",
    options: ["onload", "onhover", "onclick", "onchange"],
    answer: "onclick",
    category: "Web Development"
  },
  {
    id: 47,
    question: "Which HTML tag defines the main content?",
    options: ["<content>", "<main>", "<section>", "<article>"],
    answer: "<main>",
    category: "Web Development"
  },
  {
    id: 48,
    question: "Which CSS property controls text alignment?",
    options: ["align", "text-align", "font-align", "position"],
    answer: "text-align",
    category: "Web Development"
  },
  {
    id: 49,
    question: "Which JavaScript method joins array elements?",
    options: ["join()", "merge()", "concat()", "link()"],
    answer: "join()",
    category: "Web Development"
  },
  {
    id: 50,
    question: "Which framework is used for responsive design?",
    options: ["Django", "Bootstrap", "Flask", "Spring"],
    answer: "Bootstrap",
    category: "Web Development"
  },
  {
    id: 51,
    question: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    answer: "Stack",
    category: "DSA"
  },
  {
    id: 52,
    question: "Which data structure follows the FIFO principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
    category: "DSA"
  },
  {
    id: 53,
    question: "Which data structure allows dynamic memory allocation?",
    options: ["Array", "Linked List", "Matrix", "String"],
    answer: "Linked List",
    category: "DSA"
  },
  {
    id: 54,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)",
    category: "DSA"
  },
  {
    id: 55,
    question: "Which data structure is used for recursion?",
    options: ["Queue", "Stack", "Heap", "Graph"],
    answer: "Stack",
    category: "DSA"
  },
  {
    id: 56,
    question: "Which traversal method uses root-left-right order?",
    options: ["Inorder", "Preorder", "Postorder", "Level order"],
    answer: "Preorder",
    category: "DSA"
  },
  {
    id: 57,
    question: "Which traversal method uses left-root-right order?",
    options: ["Preorder", "Inorder", "Postorder", "DFS"],
    answer: "Inorder",
    category: "DSA"
  },
  {
    id: 58,
    question: "Which traversal uses breadth-first approach?",
    options: ["DFS", "Inorder", "BFS", "Recursion"],
    answer: "BFS",
    category: "DSA"
  },
  {
    id: 59,
    question: "Which data structure is used to implement BFS?",
    options: ["Stack", "Queue", "Array", "Tree"],
    answer: "Queue",
    category: "DSA"
  },
  {
    id: 60,
    question: "Which data structure is used to implement DFS?",
    options: ["Queue", "Stack", "Heap", "Graph"],
    answer: "Stack",
    category: "DSA"
  },
  {
    id: 61,
    question: "Which sorting algorithm has the best average time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
    answer: "Quick Sort",
    category: "DSA"
  },
  {
    id: 62,
    question: "Which sorting algorithm is the slowest?",
    options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
    answer: "Bubble Sort",
    category: "DSA"
  },
  {
    id: 63,
    question: "Which sorting algorithm is stable?",
    options: ["Quick Sort", "Heap Sort", "Bubble Sort", "Selection Sort"],
    answer: "Bubble Sort",
    category: "DSA"
  },
  {
    id: 64,
    question: "Which data structure is non-linear?",
    options: ["Array", "Stack", "Queue", "Tree"],
    answer: "Tree",
    category: "DSA"
  },
  {
    id: 65,
    question: "Which data structure stores elements in key-value pairs?",
    options: ["Array", "Stack", "Hash Table", "Queue"],
    answer: "Hash Table",
    category: "DSA"
  },
  {
    id: 66,
    question: "What is the worst-case time complexity of linear search?",
    options: ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
    answer: "O(n)",
    category: "DSA"
  },
  {
    id: 67,
    question: "Which data structure is best for implementing priority queues?",
    options: ["Stack", "Queue", "Heap", "Array"],
    answer: "Heap",
    category: "DSA"
  },
  {
    id: 68,
    question: "Which tree has at most two children?",
    options: ["Binary Tree", "AVL Tree", "B-Tree", "Heap"],
    answer: "Binary Tree",
    category: "DSA"
  },
  {
    id: 69,
    question: "Which data structure is used in undo operations?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    answer: "Stack",
    category: "DSA"
  },
  {
    id: 70,
    question: "What is the height of a tree with one node?",
    options: ["0", "1", "2", "Depends on tree"],
    answer: "0",
    category: "DSA"
  },
  {
    id: 71,
    question: "Which data structure allows insertion and deletion at both ends?",
    options: ["Stack", "Queue", "Deque", "Array"],
    answer: "Deque",
    category: "DSA"
  },
  {
    id: 72,
    question: "Which algorithm is used to find the shortest path?",
    options: ["DFS", "BFS", "Dijkstra", "Prim"],
    answer: "Dijkstra",
    category: "DSA"
  },
  {
    id: 73,
    question: "Which algorithm is used to find minimum spanning tree?",
    options: ["Dijkstra", "Prim", "BFS", "DFS"],
    answer: "Prim",
    category: "DSA"
  },
  {
    id: 74,
    question: "Which data structure is used for expression evaluation?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    answer: "Stack",
    category: "DSA"
  },
  {
    id: 75,
    question: "Which graph traversal uses stack implicitly?",
    options: ["BFS", "DFS", "Dijkstra", "Prim"],
    answer: "DFS",
    category: "DSA"
  },
  {
    id: 76,
    question: "Which searching technique works only on sorted data?",
    options: ["Linear Search", "Binary Search", "Hashing", "DFS"],
    answer: "Binary Search",
    category: "DSA"
  },
  {
    id: 77,
    question: "Which data structure is used to implement recursion internally?",
    options: ["Queue", "Stack", "Heap", "Array"],
    answer: "Stack",
    category: "DSA"
  },
  {
    id: 78,
    question: "Which sorting algorithm divides the array into halves?",
    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort"],
    answer: "Merge Sort",
    category: "DSA"
  },
  {
    id: 79,
    question: "Which structure connects nodes via edges?",
    options: ["Tree", "Graph", "Stack", "Queue"],
    answer: "Graph",
    category: "DSA"
  },
  {
    id: 80,
    question: "Which data structure is used in LRU cache?",
    options: ["Queue", "Stack", "Hash Map", "Array"],
    answer: "Hash Map",
    category: "DSA"
  },
  {
    id: 81,
    question: "Which sorting algorithm uses swapping of adjacent elements?",
    options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Heap Sort"],
    answer: "Bubble Sort",
    category: "DSA"
  },
  {
    id: 82,
    question: "Which operation is faster in hash tables?",
    options: ["Search", "Traversal", "Sorting", "Indexing"],
    answer: "Search",
    category: "DSA"
  },
  {
    id: 83,
    question: "Which data structure uses pointers?",
    options: ["Array", "Linked List", "Matrix", "String"],
    answer: "Linked List",
    category: "DSA"
  },
  {
    id: 84,
    question: "Which tree is self-balancing?",
    options: ["Binary Tree", "AVL Tree", "Heap", "Trie"],
    answer: "AVL Tree",
    category: "DSA"
  },
  {
    id: 85,
    question: "Which traversal visits nodes level by level?",
    options: ["DFS", "Inorder", "Preorder", "Level Order"],
    answer: "Level Order",
    category: "DSA"
  },
  {
    id: 86,
    question: "Which data structure is best for scheduling tasks?",
    options: ["Stack", "Queue", "Array", "Tree"],
    answer: "Queue",
    category: "DSA"
  },
  {
    id: 87,
    question: "Which algorithm has divide and conquer strategy?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    answer: "Merge Sort",
    category: "DSA"
  },
  {
    id: 88,
    question: "Which structure is used for hierarchical data?",
    options: ["Array", "Queue", "Tree", "Stack"],
    answer: "Tree",
    category: "DSA"
  },
  {
    id: 89,
    question: "Which data structure is used in parentheses checking?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    answer: "Stack",
    category: "DSA"
  },
  {
    id: 90,
    question: "Which sorting algorithm uses pivot element?",
    options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Insertion Sort"],
    answer: "Quick Sort",
    category: "DSA"
  },
  {
    id: 91,
    question: "Which graph can be directed?",
    options: ["Tree", "Undirected Graph", "Directed Graph", "Heap"],
    answer: "Directed Graph",
    category: "DSA"
  },
  {
    id: 92,
    question: "Which data structure is best for memory management?",
    options: ["Queue", "Stack", "Heap", "Array"],
    answer: "Heap",
    category: "DSA"
  },
  {
    id: 93,
    question: "Which data structure is used in browser back button?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    answer: "Stack",
    category: "DSA"
  },
  {
    id: 94,
    question: "Which algorithm is used for cycle detection?",
    options: ["DFS", "BFS", "Dijkstra", "Binary Search"],
    answer: "DFS",
    category: "DSA"
  },
  {
    id: 95,
    question: "Which structure stores unique elements efficiently?",
    options: ["Array", "List", "Set", "Queue"],
    answer: "Set",
    category: "DSA"
  },
  {
    id: 96,
    question: "Which algorithm is best for small datasets?",
    options: ["Merge Sort", "Quick Sort", "Insertion Sort", "Heap Sort"],
    answer: "Insertion Sort",
    category: "DSA"
  },
  {
    id: 97,
    question: "Which data structure is best for fast lookup?",
    options: ["Stack", "Queue", "Hash Table", "Tree"],
    answer: "Hash Table",
    category: "DSA"
  },
  {
    id: 98,
    question: "Which operation is not allowed in stack?",
    options: ["Push", "Pop", "Peek", "Random Access"],
    answer: "Random Access",
    category: "DSA"
  },
  {
    id: 99,
    question: "Which structure represents relationships between entities?",
    options: ["Array", "Graph", "Stack", "Queue"],
    answer: "Graph",
    category: "DSA"
  },
  {
    id: 100,
    question: "Which data structure uses contiguous memory?",
    options: ["Linked List", "Tree", "Array", "Graph"],
    answer: "Array",
    category: "DSA"
  },
   {
    id: 101,
    question: "What does OOP stand for?",
    options: ["Object Oriented Programming", "Open Object Programming", "Object Operated Program", "Order of Programming"],
    answer: "Object Oriented Programming",
    category: "Object Oriented Programming"
  },
  {
    id: 102,
    question: "Which of the following is NOT an OOP principle?",
    options: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"],
    answer: "Compilation",
    category: "Object Oriented Programming"
  },
  {
    id: 103,
    question: "Which OOP concept binds data and methods together?",
    options: ["Inheritance", "Encapsulation", "Abstraction", "Polymorphism"],
    answer: "Encapsulation",
    category: "Object Oriented Programming"
  },
  {
    id: 104,
    question: "Which concept allows a class to acquire properties of another class?",
    options: ["Abstraction", "Encapsulation", "Inheritance", "Polymorphism"],
    answer: "Inheritance",
    category: "Object Oriented Programming"
  },
  {
    id: 105,
    question: "Which OOP feature allows one function to have many forms?",
    options: ["Encapsulation", "Inheritance", "Abstraction", "Polymorphism"],
    answer: "Polymorphism",
    category: "Object Oriented Programming"
  },
  {
    id: 106,
    question: "What is a class in OOP?",
    options: ["A real-world object", "A blueprint for objects", "A function", "A variable"],
    answer: "A blueprint for objects",
    category: "Object Oriented Programming"
  },
  {
    id: 107,
    question: "What is an object?",
    options: ["A class", "An instance of a class", "A method", "A variable"],
    answer: "An instance of a class",
    category: "Object Oriented Programming"
  },
  {
    id: 108,
    question: "Which access modifier allows access only within the same class?",
    options: ["public", "protected", "private", "default"],
    answer: "private",
    category: "Object Oriented Programming"
  },
  {
    id: 109,
    question: "Which access modifier allows access within the same package and subclasses?",
    options: ["private", "public", "protected", "static"],
    answer: "protected",
    category: "Object Oriented Programming"
  },
  {
    id: 110,
    question: "Which keyword is used to create an object?",
    options: ["class", "this", "new", "create"],
    answer: "new",
    category: "Object Oriented Programming"
  },
  {
    id: 111,
    question: "What is method overloading?",
    options: [
      "Same method name with different parameters",
      "Same method name in different classes",
      "Same method with same parameters",
      "Multiple inheritance"
    ],
    answer: "Same method name with different parameters",
    category: "Object Oriented Programming"
  },
  {
    id: 112,
    question: "What is method overriding?",
    options: [
      "Same method name with different parameters",
      "Redefining a parent class method",
      "Calling parent method",
      "Using static methods"
    ],
    answer: "Redefining a parent class method",
    category: "Object Oriented Programming"
  },
  {
    id: 113,
    question: "Which keyword refers to the current object?",
    options: ["this", "super", "self", "current"],
    answer: "this",
    category: "Object Oriented Programming"
  },
  {
    id: 114,
    question: "Which keyword is used to access parent class members?",
    options: ["this", "base", "parent", "super"],
    answer: "super",
    category: "Object Oriented Programming"
  },
  {
    id: 115,
    question: "Which concept hides implementation details?",
    options: ["Encapsulation", "Inheritance", "Abstraction", "Polymorphism"],
    answer: "Abstraction",
    category: "Object Oriented Programming"
  },
  {
    id: 116,
    question: "Which of the following supports multiple inheritance?",
    options: ["Java", "C#", "Python", "C++"],
    answer: "C++",
    category: "Object Oriented Programming"
  },
  {
    id: 117,
    question: "What is an interface?",
    options: [
      "A class with implementation",
      "A class with variables only",
      "A collection of abstract methods",
      "A data structure"
    ],
    answer: "A collection of abstract methods",
    category: "Object Oriented Programming"
  },
  {
    id: 118,
    question: "Which keyword is used to inherit a class in Java?",
    options: ["inherits", "extends", "implements", "super"],
    answer: "extends",
    category: "Object Oriented Programming"
  },
  {
    id: 119,
    question: "Which keyword is used to implement an interface?",
    options: ["extends", "inherits", "implements", "override"],
    answer: "implements",
    category: "Object Oriented Programming"
  },
  {
    id: 120,
    question: "What is a constructor?",
    options: [
      "A method to destroy objects",
      "A method to initialize objects",
      "A static method",
      "An abstract method"
    ],
    answer: "A method to initialize objects",
    category: "Object Oriented Programming"
  },
  {
    id: 121,
    question: "Which constructor has no parameters?",
    options: ["Parameterized constructor", "Default constructor", "Static constructor", "Copy constructor"],
    answer: "Default constructor",
    category: "Object Oriented Programming"
  },
  {
    id: 122,
    question: "Which OOP concept improves code reusability?",
    options: ["Encapsulation", "Abstraction", "Inheritance", "Compilation"],
    answer: "Inheritance",
    category: "Object Oriented Programming"
  },
  {
    id: 123,
    question: "Which feature allows different behavior for the same method call?",
    options: ["Inheritance", "Abstraction", "Encapsulation", "Polymorphism"],
    answer: "Polymorphism",
    category: "Object Oriented Programming"
  },
  {
    id: 124,
    question: "Which type of binding occurs at runtime?",
    options: ["Static binding", "Dynamic binding", "Compile-time binding", "Early binding"],
    answer: "Dynamic binding",
    category: "Object Oriented Programming"
  },
  {
    id: 125,
    question: "Which method cannot be overridden?",
    options: ["Static method", "Public method", "Protected method", "Virtual method"],
    answer: "Static method",
    category: "Object Oriented Programming"
  },
  {
    id: 126,
    question: "Which class cannot be inherited?",
    options: ["Abstract class", "Final class", "Base class", "Parent class"],
    answer: "Final class",
    category: "Object Oriented Programming"
  },
  {
    id: 127,
    question: "What is data hiding?",
    options: [
      "Hiding logic",
      "Hiding variables using access modifiers",
      "Deleting data",
      "Encrypting data"
    ],
    answer: "Hiding variables using access modifiers",
    category: "Object Oriented Programming"
  },
  {
    id: 128,
    question: "Which keyword prevents inheritance?",
    options: ["private", "static", "final", "abstract"],
    answer: "final",
    category: "Object Oriented Programming"
  },
  {
    id: 129,
    question: "Which OOP concept is achieved using abstract classes?",
    options: ["Encapsulation", "Inheritance", "Abstraction", "Compilation"],
    answer: "Abstraction",
    category: "Object Oriented Programming"
  },
  {
    id: 130,
    question: "Which class contains only abstract methods?",
    options: ["Normal class", "Abstract class", "Interface", "Final class"],
    answer: "Interface",
    category: "Object Oriented Programming"
  },
  {
    id: 131,
    question: "Which OOP principle focuses on what an object does?",
    options: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
    answer: "Abstraction",
    category: "Object Oriented Programming"
  },
  {
    id: 132,
    question: "Which type of inheritance is not supported in Java?",
    options: ["Single", "Multilevel", "Hierarchical", "Multiple"],
    answer: "Multiple",
    category: "Object Oriented Programming"
  },
  {
    id: 133,
    question: "What is a base class?",
    options: ["Child class", "Derived class", "Parent class", "Final class"],
    answer: "Parent class",
    category: "Object Oriented Programming"
  },
  {
    id: 134,
    question: "What is a derived class?",
    options: ["Parent class", "Base class", "Child class", "Interface"],
    answer: "Child class",
    category: "Object Oriented Programming"
  },
  {
    id: 135,
    question: "Which method is called automatically when an object is created?",
    options: ["Destructor", "Constructor", "Main method", "Init method"],
    answer: "Constructor",
    category: "Object Oriented Programming"
  },
  {
    id: 136,
    question: "Which keyword is used to define an abstract method?",
    options: ["virtual", "abstract", "static", "final"],
    answer: "abstract",
    category: "Object Oriented Programming"
  },
  {
    id: 137,
    question: "Which access modifier provides the widest accessibility?",
    options: ["private", "protected", "default", "public"],
    answer: "public",
    category: "Object Oriented Programming"
  },
  {
    id: 138,
    question: "Which feature allows objects to communicate?",
    options: ["Inheritance", "Method calling", "Abstraction", "Encapsulation"],
    answer: "Method calling",
    category: "Object Oriented Programming"
  },
  {
    id: 139,
    question: "Which concept reduces complexity?",
    options: ["Inheritance", "Encapsulation", "Abstraction", "Polymorphism"],
    answer: "Abstraction",
    category: "Object Oriented Programming"
  },
  {
    id: 140,
    question: "Which method belongs to a class rather than an object?",
    options: ["Instance method", "Virtual method", "Static method", "Abstract method"],
    answer: "Static method",
    category: "Object Oriented Programming"
  },
  {
    id: 141,
    question: "Which OOP feature ensures security in OOP?",
    options: ["Inheritance", "Abstraction", "Encapsulation", "Polymorphism"],
    answer: "Encapsulation",
    category: "Object Oriented Programming"
  },
  {
    id: 142,
    question: "Which keyword is used to stop method overriding?",
    options: ["static", "private", "final", "abstract"],
    answer: "final",
    category: "Object Oriented Programming"
  },
  {
    id: 143,
    question: "Which class can have both abstract and non-abstract methods?",
    options: ["Interface", "Final class", "Abstract class", "Static class"],
    answer: "Abstract class",
    category: "Object Oriented Programming"
  },
  {
    id: 144,
    question: "Which OOP concept is used in real-world modeling?",
    options: ["Encapsulation", "Abstraction", "Inheritance", "All of these"],
    answer: "All of these",
    category: "Object Oriented Programming"
  },
  {
    id: 145,
    question: "Which term describes the relationship between classes?",
    options: ["Encapsulation", "Association", "Compilation", "Execution"],
    answer: "Association",
    category: "Object Oriented Programming"
  },
  {
    id: 146,
    question: "Which relationship represents 'has-a'?",
    options: ["Inheritance", "Association", "Aggregation", "Polymorphism"],
    answer: "Aggregation",
    category: "Object Oriented Programming"
  },
  {
    id: 147,
    question: "Which relationship represents 'is-a'?",
    options: ["Aggregation", "Composition", "Inheritance", "Encapsulation"],
    answer: "Inheritance",
    category: "Object Oriented Programming"
  },
  {
    id: 148,
    question: "Which concept improves maintainability?",
    options: ["Inheritance", "Encapsulation", "Abstraction", "All of these"],
    answer: "All of these",
    category: "Object Oriented Programming"
  },
  {
    id: 149,
    question: "Which OOP feature supports code flexibility?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"],
    answer: "Polymorphism",
    category: "Object Oriented Programming"
  },
  {
    id: 150,
    question: "Which concept allows program extensibility?",
    options: ["Abstraction", "Inheritance", "Encapsulation", "Finalization"],
    answer: "Inheritance",
    category: "Object Oriented Programming"
  },
  {
    id: 151,
    question: "What is a computer network?",
    options: [
      "A collection of computers connected together",
      "A single computer system",
      "A software application",
      "A database system"
    ],
    answer: "A collection of computers connected together",
    category: "Computer Networks"
  },
  {
    id: 152,
    question: "Which device connects multiple networks together?",
    options: ["Switch", "Hub", "Router", "Repeater"],
    answer: "Router",
    category: "Computer Networks"
  },
  {
    id: 153,
    question: "Which device operates at the Physical layer?",
    options: ["Router", "Switch", "Hub", "Gateway"],
    answer: "Hub",
    category: "Computer Networks"
  },
  {
    id: 154,
    question: "What does LAN stand for?",
    options: [
      "Local Area Network",
      "Large Area Network",
      "Logical Area Network",
      "Long Area Network"
    ],
    answer: "Local Area Network",
    category: "Computer Networks"
  },
  {
    id: 155,
    question: "What does WAN stand for?",
    options: [
      "Wide Area Network",
      "Wireless Area Network",
      "World Area Network",
      "Web Area Network"
    ],
    answer: "Wide Area Network",
    category: "Computer Networks"
  },
  {
    id: 156,
    question: "Which topology uses a central device?",
    options: ["Bus", "Ring", "Star", "Mesh"],
    answer: "Star",
    category: "Computer Networks"
  },
  {
    id: 157,
    question: "Which topology has no central device?",
    options: ["Star", "Bus", "Tree", "Hybrid"],
    answer: "Bus",
    category: "Computer Networks"
  },
  {
    id: 158,
    question: "Which topology provides high fault tolerance?",
    options: ["Bus", "Star", "Ring", "Mesh"],
    answer: "Mesh",
    category: "Computer Networks"
  },
  {
    id: 159,
    question: "What is the main function of a switch?",
    options: [
      "Broadcast data",
      "Forward data using MAC address",
      "Connect different networks",
      "Amplify signals"
    ],
    answer: "Forward data using MAC address",
    category: "Computer Networks"
  },
  {
    id: 160,
    question: "Which address is used at the Data Link layer?",
    options: ["IP address", "MAC address", "Port number", "Logical address"],
    answer: "MAC address",
    category: "Computer Networks"
  },
  {
    id: 161,
    question: "Which protocol is used to send emails?",
    options: ["FTP", "SMTP", "HTTP", "SNMP"],
    answer: "SMTP",
    category: "Computer Networks"
  },
  {
    id: 162,
    question: "Which protocol is used to receive emails?",
    options: ["SMTP", "POP3", "FTP", "HTTP"],
    answer: "POP3",
    category: "Computer Networks"
  },
  {
    id: 163,
    question: "Which protocol is used for web browsing?",
    options: ["FTP", "SMTP", "HTTP", "SNMP"],
    answer: "HTTP",
    category: "Computer Networks"
  },
  {
    id: 164,
    question: "What does IP stand for?",
    options: [
      "Internet Protocol",
      "Internal Protocol",
      "Internet Process",
      "Integrated Protocol"
    ],
    answer: "Internet Protocol",
    category: "Computer Networks"
  },
  {
    id: 165,
    question: "Which IP version uses 32-bit addressing?",
    options: ["IPv4", "IPv6", "IPv8", "IPv10"],
    answer: "IPv4",
    category: "Computer Networks"
  },
  {
    id: 166,
    question: "Which IP version uses 128-bit addressing?",
    options: ["IPv4", "IPv6", "IPv5", "IPv2"],
    answer: "IPv6",
    category: "Computer Networks"
  },
  {
    id: 167,
    question: "What is the default port number for HTTP?",
    options: ["21", "25", "80", "443"],
    answer: "80",
    category: "Computer Networks"
  },
  {
    id: 168,
    question: "What is the default port number for HTTPS?",
    options: ["80", "21", "443", "110"],
    answer: "443",
    category: "Computer Networks"
  },
  {
    id: 169,
    question: "Which protocol provides secure communication over the web?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    answer: "HTTPS",
    category: "Computer Networks"
  },
  {
    id: 170,
    question: "What is the function of DNS?",
    options: [
      "Assign IP addresses",
      "Translate domain names to IP addresses",
      "Secure data transfer",
      "Send emails"
    ],
    answer: "Translate domain names to IP addresses",
    category: "Computer Networks"
  },
  {
    id: 171,
    question: "Which protocol assigns IP addresses automatically?",
    options: ["DNS", "DHCP", "ARP", "ICMP"],
    answer: "DHCP",
    category: "Computer Networks"
  },
  {
    id: 172,
    question: "What does MAC stand for?",
    options: [
      "Media Access Control",
      "Machine Access Code",
      "Memory Access Control",
      "Main Access Channel"
    ],
    answer: "Media Access Control",
    category: "Computer Networks"
  },
  {
    id: 173,
    question: "Which layer of OSI model is responsible for routing?",
    options: [
      "Transport",
      "Network",
      "Data Link",
      "Physical"
    ],
    answer: "Network",
    category: "Computer Networks"
  },
  {
    id: 174,
    question: "How many layers are in the OSI model?",
    options: ["5", "6", "7", "8"],
    answer: "7",
    category: "Computer Networks"
  },
  {
    id: 175,
    question: "Which OSI layer deals with encryption?",
    options: [
      "Session",
      "Presentation",
      "Transport",
      "Application"
    ],
    answer: "Presentation",
    category: "Computer Networks"
  },
  {
    id: 176,
    question: "Which OSI layer provides end-to-end communication?",
    options: [
      "Network",
      "Transport",
      "Session",
      "Data Link"
    ],
    answer: "Transport",
    category: "Computer Networks"
  },
  {
    id: 177,
    question: "Which protocol is connection-oriented?",
    options: ["UDP", "ICMP", "TCP", "ARP"],
    answer: "TCP",
    category: "Computer Networks"
  },
  {
    id: 178,
    question: "Which protocol is connectionless?",
    options: ["TCP", "FTP", "UDP", "SMTP"],
    answer: "UDP",
    category: "Computer Networks"
  },
  {
    id: 179,
    question: "What is packet switching?",
    options: [
      "Data sent in small packets",
      "Data sent in one block",
      "Circuit-based communication",
      "Analog transmission"
    ],
    answer: "Data sent in small packets",
    category: "Computer Networks"
  },
  {
    id: 180,
    question: "Which protocol is used to find MAC address from IP address?",
    options: ["ARP", "RARP", "DNS", "ICMP"],
    answer: "ARP",
    category: "Computer Networks"
  },
  {
    id: 181,
    question: "Which protocol reports errors and network status?",
    options: ["TCP", "UDP", "ICMP", "FTP"],
    answer: "ICMP",
    category: "Computer Networks"
  },
  {
    id: 182,
    question: "Which device regenerates signals?",
    options: ["Router", "Switch", "Repeater", "Gateway"],
    answer: "Repeater",
    category: "Computer Networks"
  },
  {
    id: 183,
    question: "What is bandwidth?",
    options: [
      "Data storage capacity",
      "Transmission speed",
      "Delay in communication",
      "Signal strength"
    ],
    answer: "Transmission speed",
    category: "Computer Networks"
  },
  {
    id: 184,
    question: "What is latency?",
    options: [
      "Data loss",
      "Transmission speed",
      "Delay in data transfer",
      "Signal noise"
    ],
    answer: "Delay in data transfer",
    category: "Computer Networks"
  },
  {
    id: 185,
    question: "Which cable has the highest data transmission rate?",
    options: [
      "Twisted pair",
      "Coaxial",
      "Fiber optic",
      "Ethernet"
    ],
    answer: "Fiber optic",
    category: "Computer Networks"
  },
  {
    id: 186,
    question: "Which network covers a city?",
    options: ["LAN", "PAN", "MAN", "WAN"],
    answer: "MAN",
    category: "Computer Networks"
  },
  {
    id: 187,
    question: "Which network covers a personal workspace?",
    options: ["LAN", "PAN", "WAN", "MAN"],
    answer: "PAN",
    category: "Computer Networks"
  },
  {
    id: 188,
    question: "What is a firewall?",
    options: [
      "A virus",
      "A security device",
      "A network cable",
      "A protocol"
    ],
    answer: "A security device",
    category: "Computer Networks"
  },
  {
    id: 189,
    question: "Which attack floods a network with traffic?",
    options: [
      "Phishing",
      "DoS attack",
      "Spoofing",
      "Sniffing"
    ],
    answer: "DoS attack",
    category: "Computer Networks"
  },
  {
    id: 190,
    question: "Which protocol is used for file transfer?",
    options: ["FTP", "SMTP", "HTTP", "SNMP"],
    answer: "FTP",
    category: "Computer Networks"
  },
  {
    id: 191,
    question: "Which protocol manages network devices?",
    options: ["FTP", "SMTP", "SNMP", "HTTP"],
    answer: "SNMP",
    category: "Computer Networks"
  },
  {
    id: 192,
    question: "Which layer is closest to the user in OSI model?",
    options: [
      "Transport",
      "Application",
      "Session",
      "Presentation"
    ],
    answer: "Application",
    category: "Computer Networks"
  },
  {
    id: 193,
    question: "Which layer is responsible for error detection?",
    options: [
      "Network",
      "Data Link",
      "Transport",
      "Application"
    ],
    answer: "Data Link",
    category: "Computer Networks"
  },
  {
    id: 194,
    question: "What is a socket?",
    options: [
      "Combination of IP and port",
      "A network cable",
      "A hardware device",
      "A protocol"
    ],
    answer: "Combination of IP and port",
    category: "Computer Networks"
  },
  {
    id: 195,
    question: "Which protocol resolves domain names?",
    options: ["ARP", "DNS", "DHCP", "ICMP"],
    answer: "DNS",
    category: "Computer Networks"
  },
  {
    id: 196,
    question: "Which topology forms a closed loop?",
    options: ["Bus", "Star", "Ring", "Mesh"],
    answer: "Ring",
    category: "Computer Networks"
  },
  {
    id: 197,
    question: "Which device connects LAN to WAN?",
    options: ["Hub", "Switch", "Router", "Repeater"],
    answer: "Router",
    category: "Computer Networks"
  },
  {
    id: 198,
    question: "Which protocol uses port number 21?",
    options: ["FTP", "HTTP", "SMTP", "POP3"],
    answer: "FTP",
    category: "Computer Networks"
  },
  {
    id: 199,
    question: "Which protocol uses port number 25?",
    options: ["FTP", "SMTP", "HTTP", "POP3"],
    answer: "SMTP",
    category: "Computer Networks"
  },
  {
    id: 200,
    question: "Which protocol uses port number 110?",
    options: ["HTTP", "POP3", "FTP", "SNMP"],
    answer: "POP3",
    category: "Computer Networks"
  },
  {
    id: 201,
    question: "What does DBMS stand for?",
    options: [
      "Database Management System",
      "Data Backup Management System",
      "Data Business Management System",
      "Database Machine System"
    ],
    answer: "Database Management System",
    category: "Database Management"
  },
  {
    id: 202,
    question: "Which of the following is a DBMS software?",
    options: ["MySQL", "Windows", "Linux", "MS Word"],
    answer: "MySQL",
    category: "Database Management"
  },
  {
    id: 203,
    question: "Which model organizes data in tables?",
    options: ["Hierarchical", "Network", "Relational", "Object-Oriented"],
    answer: "Relational",
    category: "Database Management"
  },
  {
    id: 204,
    question: "What is a table in DBMS called?",
    options: ["Entity", "Relation", "Attribute", "Tuple"],
    answer: "Relation",
    category: "Database Management"
  },
  {
    id: 205,
    question: "What is a row in a table called?",
    options: ["Attribute", "Field", "Tuple", "Column"],
    answer: "Tuple",
    category: "Database Management"
  },
  {
    id: 206,
    question: "What is a column in a table called?",
    options: ["Tuple", "Relation", "Attribute", "Record"],
    answer: "Attribute",
    category: "Database Management"
  },
  {
    id: 207,
    question: "Which key uniquely identifies a record?",
    options: ["Foreign key", "Primary key", "Candidate key", "Composite key"],
    answer: "Primary key",
    category: "Database Management"
  },
  {
    id: 208,
    question: "Which key creates a relationship between tables?",
    options: ["Primary key", "Foreign key", "Super key", "Alternate key"],
    answer: "Foreign key",
    category: "Database Management"
  },
  {
    id: 209,
    question: "Which language is used to query databases?",
    options: ["HTML", "SQL", "CSS", "Python"],
    answer: "SQL",
    category: "Database Management"
  },
  {
    id: 210,
    question: "Which SQL command is used to retrieve data?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    answer: "SELECT",
    category: "Database Management"
  },
  {
    id: 211,
    question: "Which SQL command is used to add new data?",
    options: ["SELECT", "INSERT", "DELETE", "DROP"],
    answer: "INSERT",
    category: "Database Management"
  },
  {
    id: 212,
    question: "Which SQL command removes data from a table?",
    options: ["DROP", "DELETE", "TRUNCATE", "REMOVE"],
    answer: "DELETE",
    category: "Database Management"
  },
  {
    id: 213,
    question: "Which SQL command removes a table permanently?",
    options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"],
    answer: "DROP",
    category: "Database Management"
  },
  {
    id: 214,
    question: "Which command removes all rows but keeps the table structure?",
    options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
    answer: "TRUNCATE",
    category: "Database Management"
  },
  {
    id: 215,
    question: "Which constraint ensures no duplicate values?",
    options: ["NOT NULL", "CHECK", "UNIQUE", "DEFAULT"],
    answer: "UNIQUE",
    category: "Database Management"
  },
  {
    id: 216,
    question: "Which constraint prevents NULL values?",
    options: ["UNIQUE", "CHECK", "NOT NULL", "PRIMARY KEY"],
    answer: "NOT NULL",
    category: "Database Management"
  },
  {
    id: 217,
    question: "Which constraint ensures valid data?",
    options: ["CHECK", "UNIQUE", "DEFAULT", "FOREIGN KEY"],
    answer: "CHECK",
    category: "Database Management"
  },
  {
    id: 218,
    question: "Which key can have NULL values?",
    options: ["Primary key", "Foreign key", "Super key", "Candidate key"],
    answer: "Foreign key",
    category: "Database Management"
  },
  {
    id: 219,
    question: "What is normalization?",
    options: [
      "Reducing data redundancy",
      "Increasing data size",
      "Encrypting data",
      "Backing up data"
    ],
    answer: "Reducing data redundancy",
    category: "Database Management"
  },
  {
    id: 220,
    question: "Which normal form removes partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: "2NF",
    category: "Database Management"
  },
  {
    id: 221,
    question: "Which normal form removes transitive dependency?",
    options: ["1NF", "2NF", "3NF", "4NF"],
    answer: "3NF",
    category: "Database Management"
  },
  {
    id: 222,
    question: "Which command modifies existing data?",
    options: ["INSERT", "UPDATE", "SELECT", "DROP"],
    answer: "UPDATE",
    category: "Database Management"
  },
  {
    id: 223,
    question: "Which clause filters records?",
    options: ["GROUP BY", "ORDER BY", "WHERE", "HAVING"],
    answer: "WHERE",
    category: "Database Management"
  },
  {
    id: 224,
    question: "Which clause groups records?",
    options: ["WHERE", "ORDER BY", "GROUP BY", "HAVING"],
    answer: "GROUP BY",
    category: "Database Management"
  },
  {
    id: 225,
    question: "Which clause sorts records?",
    options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"],
    answer: "ORDER BY",
    category: "Database Management"
  },
  {
    id: 226,
    question: "Which clause filters grouped data?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    answer: "HAVING",
    category: "Database Management"
  },
  {
    id: 227,
    question: "Which join returns matching records?",
    options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"],
    answer: "INNER JOIN",
    category: "Database Management"
  },
  {
    id: 228,
    question: "Which join returns all records from left table?",
    options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"],
    answer: "LEFT JOIN",
    category: "Database Management"
  },
  {
    id: 229,
    question: "Which join returns all records from both tables?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
    answer: "FULL JOIN",
    category: "Database Management"
  },
  {
    id: 230,
    question: "What is a view?",
    options: [
      "Virtual table",
      "Physical table",
      "Index",
      "Schema"
    ],
    answer: "Virtual table",
    category: "Database Management"
  },
  {
    id: 231,
    question: "What is an index used for?",
    options: [
      "Increase storage",
      "Speed up data retrieval",
      "Encrypt data",
      "Backup data"
    ],
    answer: "Speed up data retrieval",
    category: "Database Management"
  },
  {
    id: 232,
    question: "Which command creates a table?",
    options: ["MAKE", "NEW", "CREATE", "BUILD"],
    answer: "CREATE",
    category: "Database Management"
  },
  {
    id: 233,
    question: "What is a schema?",
    options: [
      "Database structure",
      "Database backup",
      "Database query",
      "Database index"
    ],
    answer: "Database structure",
    category: "Database Management"
  },
  {
    id: 234,
    question: "Which database is NoSQL?",
    options: ["MySQL", "Oracle", "MongoDB", "PostgreSQL"],
    answer: "MongoDB",
    category: "Database Management"
  },
  {
    id: 235,
    question: "What does ACID stand for?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Control, Integrity, Data",
      "Access, Control, Index, Data",
      "Atomicity, Concurrency, Integrity, Durability"
    ],
    answer: "Atomicity, Consistency, Isolation, Durability",
    category: "Database Management"
  },
  {
    id: 236,
    question: "Which property ensures transactions are permanent?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    answer: "Durability",
    category: "Database Management"
  },
  {
    id: 237,
    question: "Which property ensures all or nothing execution?",
    options: ["Consistency", "Atomicity", "Isolation", "Durability"],
    answer: "Atomicity",
    category: "Database Management"
  },
  {
    id: 238,
    question: "What is a transaction?",
    options: [
      "Single SQL command",
      "Group of operations",
      "Database backup",
      "Table creation"
    ],
    answer: "Group of operations",
    category: "Database Management"
  },
  {
    id: 239,
    question: "Which command saves a transaction?",
    options: ["SAVE", "COMMIT", "ROLLBACK", "END"],
    answer: "COMMIT",
    category: "Database Management"
  },
  {
    id: 240,
    question: "Which command undoes a transaction?",
    options: ["UNDO", "ROLLBACK", "CANCEL", "STOP"],
    answer: "ROLLBACK",
    category: "Database Management"
  },
  {
    id: 241,
    question: "What is data redundancy?",
    options: [
      "Duplicate data",
      "Missing data",
      "Encrypted data",
      "Sorted data"
    ],
    answer: "Duplicate data",
    category: "Database Management"
  },
  {
    id: 242,
    question: "Which model uses parent-child relationship?",
    options: ["Relational", "Network", "Hierarchical", "Object-Oriented"],
    answer: "Hierarchical",
    category: "Database Management"
  },
  {
    id: 243,
    question: "Which model allows many-to-many relationships?",
    options: ["Hierarchical", "Relational", "Network", "File system"],
    answer: "Network",
    category: "Database Management"
  },
  {
    id: 244,
    question: "Which database object stores data physically?",
    options: ["View", "Index", "Table", "Schema"],
    answer: "Table",
    category: "Database Management"
  },
  {
    id: 245,
    question: "Which command renames a table?",
    options: ["CHANGE", "RENAME", "ALTER", "MODIFY"],
    answer: "ALTER",
    category: "Database Management"
  },
  {
    id: 246,
    question: "Which SQL function returns total count?",
    options: ["SUM()", "AVG()", "COUNT()", "MAX()"],
    answer: "COUNT()",
    category: "Database Management"
  },
  {
    id: 247,
    question: "Which SQL function returns average?",
    options: ["AVG()", "SUM()", "COUNT()", "MIN()"],
    answer: "AVG()",
    category: "Database Management"
  },
  {
    id: 248,
    question: "Which SQL function returns highest value?",
    options: ["MAX()", "MIN()", "SUM()", "COUNT()"],
    answer: "MAX()",
    category: "Database Management"
  },
  {
    id: 249,
    question: "Which SQL function returns lowest value?",
    options: ["MAX()", "SUM()", "MIN()", "COUNT()"],
    answer: "MIN()",
    category: "Database Management"
  },
  {
    id: 250,
    question: "Which DBMS component interacts with users?",
    options: [
      "Storage Manager",
      "Query Processor",
      "Transaction Manager",
      "Database Engine"
    ],
    answer: "Query Processor",
    category: "Database Management"
  },
  {
    id: 251,
    question: "What is cyber security?",
    options: [
      "Protection of physical devices",
      "Protection of data and systems from cyber attacks",
      "Software development process",
      "Network installation"
    ],
    answer: "Protection of data and systems from cyber attacks",
    category: "Cyber Security"
  },
  {
    id: 252,
    question: "Which of the following is a cyber attack?",
    options: ["Phishing", "Debugging", "Compilation", "Virtualization"],
    answer: "Phishing",
    category: "Cyber Security"
  },
  {
    id: 253,
    question: "What is malware?",
    options: [
      "Hardware failure",
      "Malicious software",
      "Secure software",
      "Network device"
    ],
    answer: "Malicious software",
    category: "Cyber Security"
  },
  {
    id: 254,
    question: "Which malware replicates itself?",
    options: ["Virus", "Spyware", "Adware", "Keylogger"],
    answer: "Virus",
    category: "Cyber Security"
  },
  {
    id: 255,
    question: "Which malware disguises itself as legitimate software?",
    options: ["Worm", "Trojan Horse", "Spyware", "Ransomware"],
    answer: "Trojan Horse",
    category: "Cyber Security"
  },
  {
    id: 256,
    question: "What does ransomware do?",
    options: [
      "Steals passwords",
      "Encrypts data and demands ransom",
      "Monitors activity",
      "Deletes operating system"
    ],
    answer: "Encrypts data and demands ransom",
    category: "Cyber Security"
  },
  {
    id: 257,
    question: "What is phishing?",
    options: [
      "Network scanning",
      "Tricking users to reveal sensitive data",
      "Encrypting files",
      "Blocking traffic"
    ],
    answer: "Tricking users to reveal sensitive data",
    category: "Cyber Security"
  },
  {
    id: 258,
    question: "Which attack floods a system with traffic?",
    options: ["Phishing", "Spoofing", "DoS attack", "Sniffing"],
    answer: "DoS attack",
    category: "Cyber Security"
  },
  {
    id: 259,
    question: "What does DDoS stand for?",
    options: [
      "Distributed Denial of Service",
      "Direct Denial of System",
      "Dynamic Data Operating System",
      "Distributed Data Security"
    ],
    answer: "Distributed Denial of Service",
    category: "Cyber Security"
  },
  {
    id: 260,
    question: "Which tool monitors network traffic?",
    options: ["Firewall", "Sniffer", "Router", "Compiler"],
    answer: "Sniffer",
    category: "Cyber Security"
  },
  {
    id: 261,
    question: "What is a firewall?",
    options: [
      "A malware",
      "A security system that monitors traffic",
      "A network cable",
      "An encryption method"
    ],
    answer: "A security system that monitors traffic",
    category: "Cyber Security"
  },
  {
    id: 262,
    question: "Which attack involves pretending to be another user?",
    options: ["Sniffing", "Spoofing", "Phishing", "Scanning"],
    answer: "Spoofing",
    category: "Cyber Security"
  },
  {
    id: 263,
    question: "What is encryption?",
    options: [
      "Deleting data",
      "Converting data into unreadable form",
      "Copying data",
      "Compressing data"
    ],
    answer: "Converting data into unreadable form",
    category: "Cyber Security"
  },
  {
    id: 264,
    question: "Which key is used in symmetric encryption?",
    options: [
      "Public key only",
      "Private key only",
      "Same key for encryption and decryption",
      "Two different keys"
    ],
    answer: "Same key for encryption and decryption",
    category: "Cyber Security"
  },
  {
    id: 265,
    question: "Which encryption uses public and private keys?",
    options: ["Symmetric", "Asymmetric", "Hashing", "Encoding"],
    answer: "Asymmetric",
    category: "Cyber Security"
  },
  {
    id: 266,
    question: "What is hashing?",
    options: [
      "Reversible encryption",
      "One-way data transformation",
      "Key exchange",
      "File compression"
    ],
    answer: "One-way data transformation",
    category: "Cyber Security"
  },
  {
    id: 267,
    question: "Which algorithm is used for password storage?",
    options: ["AES", "RSA", "Hashing", "DES"],
    answer: "Hashing",
    category: "Cyber Security"
  },
  {
    id: 268,
    question: "What is two-factor authentication?",
    options: [
      "Two passwords",
      "Password and username",
      "Two-step verification",
      "One-time login"
    ],
    answer: "Two-step verification",
    category: "Cyber Security"
  },
  {
    id: 269,
    question: "Which attack captures keystrokes?",
    options: ["Virus", "Keylogger", "Worm", "Spyware"],
    answer: "Keylogger",
    category: "Cyber Security"
  },
  {
    id: 270,
    question: "What is spyware?",
    options: [
      "Software that monitors user activity",
      "Software that deletes files",
      "Software that speeds up system",
      "Software that encrypts data"
    ],
    answer: "Software that monitors user activity",
    category: "Cyber Security"
  },
  {
    id: 271,
    question: "Which protocol provides secure web communication?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    answer: "HTTPS",
    category: "Cyber Security"
  },
  {
    id: 272,
    question: "What does SSL/TLS provide?",
    options: [
      "Data encryption",
      "Data storage",
      "Network routing",
      "User authentication only"
    ],
    answer: "Data encryption",
    category: "Cyber Security"
  },
  {
    id: 273,
    question: "Which attack intercepts communication?",
    options: ["DoS", "MITM", "Phishing", "Spoofing"],
    answer: "MITM",
    category: "Cyber Security"
  },
  {
    id: 274,
    question: "What does MITM stand for?",
    options: [
      "Man In The Middle",
      "Machine In The Middle",
      "Message In The Mail",
      "Monitor In The Machine"
    ],
    answer: "Man In The Middle",
    category: "Cyber Security"
  },
  {
    id: 275,
    question: "Which attack exploits software vulnerabilities?",
    options: ["Patch", "Exploit", "Firewall", "Encryption"],
    answer: "Exploit",
    category: "Cyber Security"
  },
  {
    id: 276,
    question: "What is a vulnerability?",
    options: [
      "A system strength",
      "A system weakness",
      "A security tool",
      "A malware type"
    ],
    answer: "A system weakness",
    category: "Cyber Security"
  },
  {
    id: 277,
    question: "Which practice fixes vulnerabilities?",
    options: ["Hacking", "Patching", "Scanning", "Spoofing"],
    answer: "Patching",
    category: "Cyber Security"
  },
  {
    id: 278,
    question: "What is social engineering?",
    options: [
      "Network configuration",
      "Manipulating people to gain information",
      "Encrypting data",
      "Building software"
    ],
    answer: "Manipulating people to gain information",
    category: "Cyber Security"
  },
  {
    id: 279,
    question: "Which attack uses fake emails?",
    options: ["Sniffing", "Phishing", "DoS", "Spoofing"],
    answer: "Phishing",
    category: "Cyber Security"
  },
  {
    id: 280,
    question: "What is brute force attack?",
    options: [
      "Guessing passwords repeatedly",
      "Blocking traffic",
      "Encrypting data",
      "Sending spam"
    ],
    answer: "Guessing passwords repeatedly",
    category: "Cyber Security"
  },
  {
    id: 281,
    question: "Which security principle ensures data is accurate?",
    options: ["Confidentiality", "Integrity", "Availability", "Authentication"],
    answer: "Integrity",
    category: "Cyber Security"
  },
  {
    id: 282,
    question: "Which security principle ensures data access?",
    options: ["Confidentiality", "Integrity", "Availability", "Authorization"],
    answer: "Availability",
    category: "Cyber Security"
  },
  {
    id: 283,
    question: "Which security principle protects privacy?",
    options: ["Integrity", "Availability", "Confidentiality", "Authentication"],
    answer: "Confidentiality",
    category: "Cyber Security"
  },
  {
    id: 284,
    question: "What is the CIA triad?",
    options: [
      "Confidentiality, Integrity, Availability",
      "Control, Information, Access",
      "Cyber, Internet, Attack",
      "Confidential, Internal, Admin"
    ],
    answer: "Confidentiality, Integrity, Availability",
    category: "Cyber Security"
  },
  {
    id: 285,
    question: "Which tool detects intrusions?",
    options: ["Firewall", "IDS", "Router", "Switch"],
    answer: "IDS",
    category: "Cyber Security"
  },
  {
    id: 286,
    question: "What does IDS stand for?",
    options: [
      "Intrusion Detection System",
      "Internet Defense Service",
      "Internal Data System",
      "Information Detection Software"
    ],
    answer: "Intrusion Detection System",
    category: "Cyber Security"
  },
  {
    id: 287,
    question: "Which tool prevents intrusions?",
    options: ["IDS", "IPS", "Sniffer", "Hub"],
    answer: "IPS",
    category: "Cyber Security"
  },
  {
    id: 288,
    question: "What does IPS stand for?",
    options: [
      "Intrusion Prevention System",
      "Internal Protection Software",
      "Internet Processing System",
      "Input Protection Service"
    ],
    answer: "Intrusion Prevention System",
    category: "Cyber Security"
  },
  {
    id: 289,
    question: "Which malware spreads without user action?",
    options: ["Virus", "Worm", "Trojan", "Spyware"],
    answer: "Worm",
    category: "Cyber Security"
  },
  {
    id: 290,
    question: "What is authentication?",
    options: [
      "Verifying user identity",
      "Granting permissions",
      "Encrypting data",
      "Logging activity"
    ],
    answer: "Verifying user identity",
    category: "Cyber Security"
  },
  {
    id: 291,
    question: "What is authorization?",
    options: [
      "Verifying identity",
      "Granting access rights",
      "Encrypting data",
      "Monitoring traffic"
    ],
    answer: "Granting access rights",
    category: "Cyber Security"
  },
  {
    id: 292,
    question: "Which attack listens to network traffic?",
    options: ["Spoofing", "Sniffing", "Phishing", "DoS"],
    answer: "Sniffing",
    category: "Cyber Security"
  },
  {
    id: 293,
    question: "Which security measure hides data?",
    options: ["Encryption", "Backup", "Firewall", "Scanning"],
    answer: "Encryption",
    category: "Cyber Security"
  },
  {
    id: 294,
    question: "What is penetration testing?",
    options: [
      "Testing security by attacking system",
      "Installing antivirus",
      "Encrypting data",
      "Backing up data"
    ],
    answer: "Testing security by attacking system",
    category: "Cyber Security"
  },
  {
    id: 295,
    question: "Which malware shows unwanted ads?",
    options: ["Spyware", "Adware", "Virus", "Worm"],
    answer: "Adware",
    category: "Cyber Security"
  },
  {
    id: 296,
    question: "What is a zero-day attack?",
    options: [
      "Attack on new vulnerability",
      "Old virus attack",
      "System shutdown",
      "Backup failure"
    ],
    answer: "Attack on new vulnerability",
    category: "Cyber Security"
  },
  {
    id: 297,
    question: "Which practice improves password security?",
    options: [
      "Short passwords",
      "Reusing passwords",
      "Strong passwords",
      "Sharing passwords"
    ],
    answer: "Strong passwords",
    category: "Cyber Security"
  },
  {
    id: 298,
    question: "Which device filters incoming and outgoing traffic?",
    options: ["Router", "Firewall", "Switch", "Hub"],
    answer: "Firewall",
    category: "Cyber Security"
  },
  {
    id: 299,
    question: "What is cybercrime?",
    options: [
      "Physical theft",
      "Crime using computers or internet",
      "Software development",
      "Network configuration"
    ],
    answer: "Crime using computers or internet",
    category: "Cyber Security"
  },
  {
    id: 300,
    question: "Which organization investigates cyber crimes internationally?",
    options: ["WHO", "UNESCO", "INTERPOL", "IMF"],
    answer: "INTERPOL",
    category: "Cyber Security"
  },
  {
    id: 301,
    question: "What is Artificial Intelligence?",
    options: [
      "Natural intelligence",
      "Simulation of human intelligence in machines",
      "Hardware design",
      "Computer networking"
    ],
    answer: "Simulation of human intelligence in machines",
    category: "Artificial Intelligence"
  },
  {
    id: 302,
    question: "Which of the following is a goal of AI?",
    options: [
      "Increase hardware size",
      "Enable machines to think and learn",
      "Improve internet speed",
      "Store large data"
    ],
    answer: "Enable machines to think and learn",
    category: "Artificial Intelligence"
  },
  {
    id: 303,
    question: "Which type of AI can perform only specific tasks?",
    options: [
      "Strong AI",
      "General AI",
      "Narrow AI",
      "Super AI"
    ],
    answer: "Narrow AI",
    category: "Artificial Intelligence"
  },
  {
    id: 304,
    question: "Which AI is capable of performing any intellectual task like humans?",
    options: [
      "Narrow AI",
      "Weak AI",
      "General AI",
      "Reactive AI"
    ],
    answer: "General AI",
    category: "Artificial Intelligence"
  },
  {
    id: 305,
    question: "Which field combines AI with statistics?",
    options: [
      "Web development",
      "Machine Learning",
      "Networking",
      "Operating Systems"
    ],
    answer: "Machine Learning",
    category: "Artificial Intelligence"
  },
  {
    id: 306,
    question: "What is Machine Learning?",
    options: [
      "Programming computers manually",
      "Machines learning from data",
      "Hardware upgrading",
      "Network communication"
    ],
    answer: "Machines learning from data",
    category: "Artificial Intelligence"
  },
  {
    id: 307,
    question: "Which type of learning uses labeled data?",
    options: [
      "Unsupervised learning",
      "Reinforcement learning",
      "Supervised learning",
      "Deep learning"
    ],
    answer: "Supervised learning",
    category: "Artificial Intelligence"
  },
  {
    id: 308,
    question: "Which type of learning uses rewards and penalties?",
    options: [
      "Supervised learning",
      "Unsupervised learning",
      "Reinforcement learning",
      "Batch learning"
    ],
    answer: "Reinforcement learning",
    category: "Artificial Intelligence"
  },
  {
    id: 309,
    question: "Which learning does NOT use labeled data?",
    options: [
      "Supervised learning",
      "Unsupervised learning",
      "Reinforcement learning",
      "Deep learning"
    ],
    answer: "Unsupervised learning",
    category: "Artificial Intelligence"
  },
  {
    id: 310,
    question: "Which algorithm is used for classification?",
    options: [
      "Linear Regression",
      "Decision Tree",
      "K-Means",
      "Apriori"
    ],
    answer: "Decision Tree",
    category: "Artificial Intelligence"
  },
  {
    id: 311,
    question: "Which algorithm is used for clustering?",
    options: [
      "K-Means",
      "Logistic Regression",
      "Decision Tree",
      "Naive Bayes"
    ],
    answer: "K-Means",
    category: "Artificial Intelligence"
  },
  {
    id: 312,
    question: "What is Deep Learning?",
    options: [
      "Learning without data",
      "Learning using neural networks with many layers",
      "Simple rule-based learning",
      "Manual programming"
    ],
    answer: "Learning using neural networks with many layers",
    category: "Artificial Intelligence"
  },
  {
    id: 313,
    question: "Which component mimics human brain cells?",
    options: [
      "Decision Tree",
      "Neuron",
      "Classifier",
      "Cluster"
    ],
    answer: "Neuron",
    category: "Artificial Intelligence"
  },
  {
    id: 314,
    question: "Which network is inspired by the human brain?",
    options: [
      "Decision Network",
      "Neural Network",
      "Bayesian Network",
      "Semantic Network"
    ],
    answer: "Neural Network",
    category: "Artificial Intelligence"
  },
  {
    id: 315,
    question: "What is an activation function?",
    options: [
      "Function to activate hardware",
      "Function that decides neuron output",
      "Database function",
      "Sorting function"
    ],
    answer: "Function that decides neuron output",
    category: "Artificial Intelligence"
  },
  {
    id: 316,
    question: "Which activation function outputs values between 0 and 1?",
    options: [
      "ReLU",
      "Sigmoid",
      "Tanh",
      "Linear"
    ],
    answer: "Sigmoid",
    category: "Artificial Intelligence"
  },
  {
    id: 317,
    question: "Which activation function is most commonly used in deep learning?",
    options: [
      "Sigmoid",
      "Tanh",
      "ReLU",
      "Linear"
    ],
    answer: "ReLU",
    category: "Artificial Intelligence"
  },
  {
    id: 318,
    question: "What is overfitting?",
    options: [
      "Model performs well on new data",
      "Model performs well on training data only",
      "Model has fewer parameters",
      "Model ignores data"
    ],
    answer: "Model performs well on training data only",
    category: "Artificial Intelligence"
  },
  {
    id: 319,
    question: "What is underfitting?",
    options: [
      "Model too complex",
      "Model too simple",
      "Model memorizes data",
      "Model ignores errors"
    ],
    answer: "Model too simple",
    category: "Artificial Intelligence"
  },
  {
    id: 320,
    question: "Which technique reduces overfitting?",
    options: [
      "Increase epochs",
      "Regularization",
      "Remove data",
      "Increase learning rate"
    ],
    answer: "Regularization",
    category: "Artificial Intelligence"
  },
  {
    id: 321,
    question: "What is training data?",
    options: [
      "Data used to test model",
      "Data used to train model",
      "Unused data",
      "Backup data"
    ],
    answer: "Data used to train model",
    category: "Artificial Intelligence"
  },
  {
    id: 322,
    question: "What is test data used for?",
    options: [
      "Training the model",
      "Evaluating model performance",
      "Creating dataset",
      "Optimizing hardware"
    ],
    answer: "Evaluating model performance",
    category: "Artificial Intelligence"
  },
  {
    id: 323,
    question: "Which metric is used for classification accuracy?",
    options: [
      "Mean Squared Error",
      "Accuracy",
      "RMSE",
      "Loss"
    ],
    answer: "Accuracy",
    category: "Artificial Intelligence"
  },
  {
    id: 324,
    question: "Which algorithm is probabilistic?",
    options: [
      "Decision Tree",
      "Naive Bayes",
      "KNN",
      "SVM"
    ],
    answer: "Naive Bayes",
    category: "Artificial Intelligence"
  },
  {
    id: 325,
    question: "Which AI technique uses rules and logic?",
    options: [
      "Expert Systems",
      "Neural Networks",
      "Deep Learning",
      "Clustering"
    ],
    answer: "Expert Systems",
    category: "Artificial Intelligence"
  },
  {
    id: 326,
    question: "What is Natural Language Processing?",
    options: [
      "Processing images",
      "Processing speech only",
      "Processing human language",
      "Processing numbers"
    ],
    answer: "Processing human language",
    category: "Artificial Intelligence"
  },
  {
    id: 327,
    question: "Which AI application is used in chatbots?",
    options: [
      "Computer Vision",
      "NLP",
      "Robotics",
      "Clustering"
    ],
    answer: "NLP",
    category: "Artificial Intelligence"
  },
  {
    id: 328,
    question: "Which AI field deals with images?",
    options: [
      "NLP",
      "Robotics",
      "Computer Vision",
      "Expert Systems"
    ],
    answer: "Computer Vision",
    category: "Artificial Intelligence"
  },
  {
    id: 329,
    question: "Which algorithm is used in recommendation systems?",
    options: [
      "Clustering",
      "Collaborative Filtering",
      "Sorting",
      "Searching"
    ],
    answer: "Collaborative Filtering",
    category: "Artificial Intelligence"
  },
  {
    id: 330,
    question: "What is a dataset?",
    options: [
      "Single value",
      "Collection of data",
      "Algorithm",
      "Model"
    ],
    answer: "Collection of data",
    category: "Artificial Intelligence"
  },
  {
    id: 331,
    question: "Which AI model predicts continuous values?",
    options: [
      "Classification",
      "Regression",
      "Clustering",
      "Association"
    ],
    answer: "Regression",
    category: "Artificial Intelligence"
  },
  {
    id: 332,
    question: "Which algorithm uses distance measurement?",
    options: [
      "Naive Bayes",
      "KNN",
      "Decision Tree",
      "Apriori"
    ],
    answer: "KNN",
    category: "Artificial Intelligence"
  },
  {
    id: 333,
    question: "What is feature selection?",
    options: [
      "Selecting output",
      "Selecting relevant input features",
      "Deleting data",
      "Normalizing output"
    ],
    answer: "Selecting relevant input features",
    category: "Artificial Intelligence"
  },
  {
    id: 334,
    question: "What is model accuracy?",
    options: [
      "Speed of model",
      "Correct predictions percentage",
      "Model size",
      "Training time"
    ],
    answer: "Correct predictions percentage",
    category: "Artificial Intelligence"
  },
  {
    id: 335,
    question: "Which AI approach uses trial and error?",
    options: [
      "Supervised learning",
      "Unsupervised learning",
      "Reinforcement learning",
      "Deep learning"
    ],
    answer: "Reinforcement learning",
    category: "Artificial Intelligence"
  },
  {
    id: 336,
    question: "What is an agent in AI?",
    options: [
      "Hardware device",
      "Entity that perceives and acts",
      "Database",
      "Network protocol"
    ],
    answer: "Entity that perceives and acts",
    category: "Artificial Intelligence"
  },
  {
    id: 337,
    question: "What is environment in AI?",
    options: [
      "Training data",
      "Surroundings of agent",
      "Hardware",
      "Software"
    ],
    answer: "Surroundings of agent",
    category: "Artificial Intelligence"
  },
  {
    id: 338,
    question: "Which search algorithm uses heuristics?",
    options: [
      "Breadth First Search",
      "Depth First Search",
      "A* Search",
      "Binary Search"
    ],
    answer: "A* Search",
    category: "Artificial Intelligence"
  },
  {
    id: 339,
    question: "Which search algorithm explores level by level?",
    options: [
      "DFS",
      "BFS",
      "A*",
      "Greedy"
    ],
    answer: "BFS",
    category: "Artificial Intelligence"
  },
  {
    id: 340,
    question: "Which search algorithm explores depth first?",
    options: [
      "BFS",
      "DFS",
      "A*",
      "Hill Climbing"
    ],
    answer: "DFS",
    category: "Artificial Intelligence"
  },
  {
    id: 341,
    question: "What is heuristic function?",
    options: [
      "Exact solution",
      "Estimated cost to reach goal",
      "Random value",
      "Database query"
    ],
    answer: "Estimated cost to reach goal",
    category: "Artificial Intelligence"
  },
  {
    id: 342,
    question: "Which AI field focuses on robots?",
    options: [
      "NLP",
      "Robotics",
      "Computer Vision",
      "Expert Systems"
    ],
    answer: "Robotics",
    category: "Artificial Intelligence"
  },
  {
    id: 343,
    question: "Which AI concept deals with reasoning?",
    options: [
      "Inference",
      "Clustering",
      "Regression",
      "Training"
    ],
    answer: "Inference",
    category: "Artificial Intelligence"
  },
  {
    id: 344,
    question: "What is knowledge representation?",
    options: [
      "Storing data",
      "Representing information for reasoning",
      "Encrypting data",
      "Compressing data"
    ],
    answer: "Representing information for reasoning",
    category: "Artificial Intelligence"
  },
  {
    id: 345,
    question: "Which logic is used in AI?",
    options: [
      "Boolean Logic",
      "Fuzzy Logic",
      "Both Boolean and Fuzzy Logic",
      "Binary Logic only"
    ],
    answer: "Both Boolean and Fuzzy Logic",
    category: "Artificial Intelligence"
  },
  {
    id: 346,
    question: "What is fuzzy logic?",
    options: [
      "Logic with true/false only",
      "Logic with degrees of truth",
      "Database logic",
      "Hardware logic"
    ],
    answer: "Logic with degrees of truth",
    category: "Artificial Intelligence"
  },
  {
    id: 347,
    question: "Which AI system can learn from experience?",
    options: [
      "Rule-based system",
      "Learning system",
      "Static system",
      "Database system"
    ],
    answer: "Learning system",
    category: "Artificial Intelligence"
  },
  {
    id: 348,
    question: "What is inference engine?",
    options: [
      "Search engine",
      "Component that applies rules to knowledge",
      "Database engine",
      "Compiler"
    ],
    answer: "Component that applies rules to knowledge",
    category: "Artificial Intelligence"
  },
  {
    id: 349,
    question: "Which AI application is used in self-driving cars?",
    options: [
      "Computer Vision",
      "NLP",
      "Expert Systems",
      "Clustering"
    ],
    answer: "Computer Vision",
    category: "Artificial Intelligence"
  },
  {
    id: 350,
    question: "Which AI technique allows machines to improve automatically?",
    options: [
      "Rule-based programming",
      "Machine Learning",
      "Hard coding",
      "Manual tuning"
    ],
    answer: "Machine Learning",
    category: "Artificial Intelligence"
  }
];

export default QUESTION_BANK;