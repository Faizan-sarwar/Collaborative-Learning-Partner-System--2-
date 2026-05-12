const QUESTION_BANK = [
  {
    id: 1,
    question: "Which of the following is a JavaScript framework for building user interfaces?",
    options: ["Laravel", "Django", "React", "Ruby on Rails"],
    answer: "React",
    category: "Web Technologies"
  },
  {
    id: 2,
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Control Style Sheets"],
    answer: "Cascading Style Sheets",
    category: "Web Technologies"
  },
  {
    id: 3,
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    answer: "<a>",
    category: "Web Technologies"
  },
  {
    id: 4,
    question: "Which language is used to structure web pages?",
    options: ["CSS", "JavaScript", "HTML", "PHP"],
    answer: "HTML",
    category: "Web Technologies"
  },
  {
    id: 5,
    question: "Which HTTP method is used to retrieve data?",
    options: ["POST", "PUT", "DELETE", "GET"],
    answer: "GET",
    category: "Web Technologies"
  },
  {
    id: 6,
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Data Object Model", "Document Oriented Method", "Digital Object Manager"],
    answer: "Document Object Model",
    category: "Web Technologies"
  },
  {
    id: 7,
    question: "Which CSS property is used to change text color?",
    options: ["font-style", "text-color", "color", "background-color"],
    answer: "color",
    category: "Web Technologies"
  },
  {
    id: 8,
    question: "Which tag is used for inserting an image in HTML?",
    options: ["<img>", "<image>", "<pic>", "<src>"],
    answer: "<img>",
    category: "Web Technologies"
  },
  {
    id: 9,
    question: "Which JavaScript keyword is used to declare a constant?",
    options: ["var", "let", "const", "static"],
    answer: "const",
    category: "Web Technologies"
  },
  {
    id: 10,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Applied Program Internet", "Application Process Integration", "Advanced Programming Interface"],
    answer: "Application Programming Interface",
    category: "Web Technologies"
  },
  {
    id: 11,
    question: "Which CSS layout model uses rows and columns?",
    options: ["Flexbox", "Grid", "Float", "Position"],
    answer: "Grid",
    category: "Web Technologies"
  },
  {
    id: 12,
    question: "Which HTML attribute is used to provide alternative text for images?",
    options: ["title", "src", "alt", "href"],
    answer: "alt",
    category: "Web Technologies"
  },
  {
    id: 13,
    question: "Which JavaScript function converts JSON to an object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.convert()"],
    answer: "JSON.parse()",
    category: "Web Technologies"
  },
  {
    id: 14,
    question: "Which port does HTTP use by default?",
    options: ["21", "25", "80", "443"],
    answer: "80",
    category: "Web Technologies"
  },
  {
    id: 15,
    question: "Which technology is used for server-side scripting?",
    options: ["HTML", "CSS", "JavaScript", "PHP"],
    answer: "PHP",
    category: "Web Technologies"
  },
  {
    id: 16,
    question: "What does URL stand for?",
    options: ["Universal Resource Locator", "Uniform Resource Locator", "Unified Resource Link", "Universal Resource Link"],
    answer: "Uniform Resource Locator",
    category: "Web Technologies"
  },
  {
    id: 17,
    question: "Which HTML tag is used to define a table row?",
    options: ["<td>", "<tr>", "<th>", "<table>"],
    answer: "<tr>",
    category: "Web Technologies"
  },
  {
    id: 18,
    question: "Which JavaScript method is used to select an element by ID?",
    options: ["getElement()", "querySelectorAll()", "getElementById()", "selectById()"],
    answer: "getElementById()",
    category: "Web Technologies"
  },
  {
    id: 19,
    question: "Which CSS property controls the space inside an element?",
    options: ["margin", "border", "padding", "spacing"],
    answer: "padding",
    category: "Web Technologies"
  },
  {
    id: 20,
    question: "Which protocol is used for secure web communication?",
    options: ["HTTP", "FTP", "SMTP", "HTTPS"],
    answer: "HTTPS",
    category: "Web Technologies"
  },
  {
    id: 21,
    question: "Which JavaScript operator is used for strict equality?",
    options: ["==", "=", "===", "!="],
    answer: "===",
    category: "Web Technologies"
  },
  {
    id: 22,
    question: "Which HTML tag is used to create an unordered list?",
    options: ["<ol>", "<ul>", "<li>", "<list>"],
    answer: "<ul>",
    category: "Web Technologies"
  },
  {
    id: 23,
    question: "Which tool is commonly used for version control?",
    options: ["Docker", "Git", "NPM", "Webpack"],
    answer: "Git",
    category: "Web Technologies"
  },
  {
    id: 24,
    question: "What does SEO stand for?",
    options: ["Search Engine Optimization", "System Engine Operation", "Search Easy Option", "Site Engine Output"],
    answer: "Search Engine Optimization",
    category: "Web Technologies"
  },
  {
    id: 25,
    question: "Which JavaScript array method adds an element to the end?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()",
    category: "Web Technologies"
  },
  {
    id: 26,
    question: "Which HTML element is used for semantic navigation?",
    options: ["<div>", "<span>", "<nav>", "<section>"],
    answer: "<nav>",
    category: "Web Technologies"
  },
  {
    id: 27,
    question: "Which CSS property is used to make text bold?",
    options: ["font-style", "font-weight", "text-bold", "style"],
    answer: "font-weight",
    category: "Web Technologies"
  },
  {
    id: 28,
    question: "Which JavaScript keyword is used to define a function?",
    options: ["method", "function", "define", "func"],
    answer: "function",
    category: "Web Technologies"
  },
  {
    id: 29,
    question: "Which file extension is used for JavaScript files?",
    options: [".js", ".java", ".jsx", ".script"],
    answer: ".js",
    category: "Web Technologies"
  },
  {
    id: 30,
    question: "Which HTML tag is used to define the document type?",
    options: ["<meta>", "<doctype>", "<!DOCTYPE>", "<html>"],
    answer: "<!DOCTYPE>",
    category: "Web Technologies"
  },
  {
    id: 31,
    question: "Which CSS property controls element positioning?",
    options: ["display", "float", "position", "align"],
    answer: "position",
    category: "Web Technologies"
  },
  {
    id: 32,
    question: "Which JavaScript loop is guaranteed to run at least once?",
    options: ["for", "while", "do...while", "foreach"],
    answer: "do...while",
    category: "Web Technologies"
  },
  {
    id: 33,
    question: "Which tag is used to embed a video?",
    options: ["<media>", "<video>", "<movie>", "<embed>"],
    answer: "<video>",
    category: "Web Technologies"
  },
  {
    id: 34,
    question: "Which HTTP status code means 'Not Found'?",
    options: ["200", "301", "404", "500"],
    answer: "404",
    category: "Web Technologies"
  },
  {
    id: 35,
    question: "Which JavaScript method removes the last array element?",
    options: ["pop()", "push()", "shift()", "splice()"],
    answer: "pop()",
    category: "Web Technologies"
  },
  {
    id: 36,
    question: "Which CSS unit is relative to the parent element?",
    options: ["px", "em", "cm", "mm"],
    answer: "em",
    category: "Web Technologies"
  },
  {
    id: 37,
    question: "Which HTML element represents the footer?",
    options: ["<bottom>", "<footer>", "<end>", "<section>"],
    answer: "<footer>",
    category: "Web Technologies"
  },
  {
    id: 38,
    question: "Which JavaScript method converts an object to JSON?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.encode()", "JSON.convert()"],
    answer: "JSON.stringify()",
    category: "Web Technologies"
  },
  {
    id: 39,
    question: "Which CSS property hides an element but keeps its space?",
    options: ["display: none", "opacity: 0", "visibility: hidden", "hidden"],
    answer: "visibility: hidden",
    category: "Web Technologies"
  },
  {
    id: 40,
    question: "Which tag is used to include JavaScript in HTML?",
    options: ["<js>", "<javascript>", "<script>", "<code>"],
    answer: "<script>",
    category: "Web Technologies"
  },
  {
    id: 41,
    question: "Which database is commonly used with web applications?",
    options: ["MySQL", "Excel", "Notepad", "Paint"],
    answer: "MySQL",
    category: "Web Technologies"
  },
  {
    id: 42,
    question: "Which CSS property changes background color?",
    options: ["color", "background", "background-color", "bgcolor"],
    answer: "background-color",
    category: "Web Technologies"
  },
  {
    id: 43,
    question: "Which JavaScript keyword stops a loop?",
    options: ["stop", "exit", "break", "end"],
    answer: "break",
    category: "Web Technologies"
  },
  {
    id: 44,
    question: "Which HTML tag is used to create a form?",
    options: ["<input>", "<form>", "<fieldset>", "<submit>"],
    answer: "<form>",
    category: "Web Technologies"
  },
  {
    id: 45,
    question: "Which CSS property is used to create rounded corners?",
    options: ["corner-radius", "round", "border-radius", "edge-radius"],
    answer: "border-radius",
    category: "Web Technologies"
  },
  {
    id: 46,
    question: "Which JavaScript event occurs when a button is clicked?",
    options: ["onload", "onhover", "onclick", "onchange"],
    answer: "onclick",
    category: "Web Technologies"
  },
  {
    id: 47,
    question: "Which HTML tag defines the main content?",
    options: ["<content>", "<main>", "<section>", "<article>"],
    answer: "<main>",
    category: "Web Technologies"
  },
  {
    id: 48,
    question: "Which CSS property controls text alignment?",
    options: ["align", "text-align", "font-align", "position"],
    answer: "text-align",
    category: "Web Technologies"
  },
  {
    id: 49,
    question: "Which JavaScript method joins array elements?",
    options: ["join()", "merge()", "concat()", "link()"],
    answer: "join()",
    category: "Web Technologies"
  },
  {
    id: 50,
    question: "Which framework is used for responsive design?",
    options: ["Django", "Bootstrap", "Flask", "Spring"],
    answer: "Bootstrap",
    category: "Web Technologies"
  },
  {
    id: 51,
    question: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    answer: "Stack",
    category: "Data Structure and Algorithms"
  },
  {
    id: 52,
    question: "Which data structure follows the FIFO principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
    category: "Data Structure and Algorithms"
  },
  {
    id: 53,
    question: "Which data structure allows dynamic memory allocation?",
    options: ["Array", "Linked List", "Matrix", "String"],
    answer: "Linked List",
    category: "Data Structure and Algorithms"
  },
  {
    id: 54,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)",
    category: "Data Structure and Algorithms"
  },
  {
    id: 55,
    question: "Which data structure is used for recursion?",
    options: ["Queue", "Stack", "Heap", "Graph"],
    answer: "Stack",
    category: "Data Structure and Algorithms"
  },
  {
    id: 56,
    question: "Which traversal method uses root-left-right order?",
    options: ["Inorder", "Preorder", "Postorder", "Level order"],
    answer: "Preorder",
    category: "Data Structure and Algorithms"
  },
  {
    id: 57,
    question: "Which traversal method uses left-root-right order?",
    options: ["Preorder", "Inorder", "Postorder", "DFS"],
    answer: "Inorder",
    category: "Data Structure and Algorithms"
  },
  {
    id: 58,
    question: "Which traversal uses breadth-first approach?",
    options: ["DFS", "Inorder", "BFS", "Recursion"],
    answer: "BFS",
    category: "Data Structure and Algorithms"
  },
  {
    id: 59,
    question: "Which data structure is used to implement BFS?",
    options: ["Stack", "Queue", "Array", "Tree"],
    answer: "Queue",
    category: "Data Structure and Algorithms"
  },
  {
    id: 60,
    question: "Which data structure is used to implement DFS?",
    options: ["Queue", "Stack", "Heap", "Graph"],
    answer: "Stack",
    category: "Data Structure and Algorithms"
  },
  {
    id: 61,
    question: "Which sorting algorithm has the best average time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
    answer: "Quick Sort",
    category: "Data Structure and Algorithms"
  },
  {
    id: 62,
    question: "Which sorting algorithm is the slowest?",
    options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
    answer: "Bubble Sort",
    category: "Data Structure and Algorithms"
  },
  {
    id: 63,
    question: "Which sorting algorithm is stable?",
    options: ["Quick Sort", "Heap Sort", "Bubble Sort", "Selection Sort"],
    answer: "Bubble Sort",
    category: "Data Structure and Algorithms"
  },
  {
    id: 64,
    question: "Which data structure is non-linear?",
    options: ["Array", "Stack", "Queue", "Tree"],
    answer: "Tree",
    category: "Data Structure and Algorithms"
  },
  {
    id: 65,
    question: "Which data structure stores elements in key-value pairs?",
    options: ["Array", "Stack", "Hash Table", "Queue"],
    answer: "Hash Table",
    category: "Data Structure and Algorithms"
  },
  {
    id: 66,
    question: "What is the worst-case time complexity of linear search?",
    options: ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
    answer: "O(n)",
    category: "Data Structure and Algorithms"
  },
  {
    id: 67,
    question: "Which data structure is best for implementing priority queues?",
    options: ["Stack", "Queue", "Heap", "Array"],
    answer: "Heap",
    category: "Data Structure and Algorithms"
  },
  {
    id: 68,
    question: "Which tree has at most two children?",
    options: ["Binary Tree", "AVL Tree", "B-Tree", "Heap"],
    answer: "Binary Tree",
    category: "Data Structure and Algorithms"
  },
  {
    id: 69,
    question: "Which data structure is used in undo operations?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    answer: "Stack",
    category: "Data Structure and Algorithms"
  },
  {
    id: 70,
    question: "What is the height of a tree with one node?",
    options: ["0", "1", "2", "Depends on tree"],
    answer: "0",
    category: "Data Structure and Algorithms"
  },
  {
    id: 71,
    question: "Which data structure allows insertion and deletion at both ends?",
    options: ["Stack", "Queue", "Deque", "Array"],
    answer: "Deque",
    category: "Data Structure and Algorithms"
  },
  {
    id: 72,
    question: "Which algorithm is used to find the shortest path?",
    options: ["DFS", "BFS", "Dijkstra", "Prim"],
    answer: "Dijkstra",
    category: "Data Structure and Algorithms"
  },
  {
    id: 73,
    question: "Which algorithm is used to find minimum spanning tree?",
    options: ["Dijkstra", "Prim", "BFS", "DFS"],
    answer: "Prim",
    category: "Data Structure and Algorithms"
  },
  {
    id: 74,
    question: "Which data structure is used for expression evaluation?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    answer: "Stack",
    category: "Data Structure and Algorithms"
  },
  {
    id: 75,
    question: "Which graph traversal uses stack implicitly?",
    options: ["BFS", "DFS", "Dijkstra", "Prim"],
    answer: "DFS",
    category: "Data Structure and Algorithms"
  },
  {
    id: 76,
    question: "Which searching technique works only on sorted data?",
    options: ["Linear Search", "Binary Search", "Hashing", "DFS"],
    answer: "Binary Search",
    category: "Data Structure and Algorithms"
  },
  {
    id: 77,
    question: "Which data structure is used to implement recursion internally?",
    options: ["Queue", "Stack", "Heap", "Array"],
    answer: "Stack",
    category: "Data Structure and Algorithms"
  },
  {
    id: 78,
    question: "Which sorting algorithm divides the array into halves?",
    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Insertion Sort"],
    answer: "Merge Sort",
    category: "Data Structure and Algorithms"
  },
  {
    id: 79,
    question: "Which structure connects nodes via edges?",
    options: ["Tree", "Graph", "Stack", "Queue"],
    answer: "Graph",
    category: "Data Structure and Algorithms"
  },
  {
    id: 80,
    question: "Which data structure is used in LRU cache?",
    options: ["Queue", "Stack", "Hash Map", "Array"],
    answer: "Hash Map",
    category: "Data Structure and Algorithms"
  },
  {
    id: 81,
    question: "Which sorting algorithm uses swapping of adjacent elements?",
    options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Heap Sort"],
    answer: "Bubble Sort",
    category: "Data Structure and Algorithms"
  },
  {
    id: 82,
    question: "Which operation is faster in hash tables?",
    options: ["Search", "Traversal", "Sorting", "Indexing"],
    answer: "Search",
    category: "Data Structure and Algorithms"
  },
  {
    id: 83,
    question: "Which data structure uses pointers?",
    options: ["Array", "Linked List", "Matrix", "String"],
    answer: "Linked List",
    category: "Data Structure and Algorithms"
  },
  {
    id: 84,
    question: "Which tree is self-balancing?",
    options: ["Binary Tree", "AVL Tree", "Heap", "Trie"],
    answer: "AVL Tree",
    category: "Data Structure and Algorithms"
  },
  {
    id: 85,
    question: "Which traversal visits nodes level by level?",
    options: ["DFS", "Inorder", "Preorder", "Level Order"],
    answer: "Level Order",
    category: "Data Structure and Algorithms"
  },
  {
    id: 86,
    question: "Which data structure is best for scheduling tasks?",
    options: ["Stack", "Queue", "Array", "Tree"],
    answer: "Queue",
    category: "Data Structure and Algorithms"
  },
  {
    id: 87,
    question: "Which algorithm has divide and conquer strategy?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    answer: "Merge Sort",
    category: "Data Structure and Algorithms"
  },
  {
    id: 88,
    question: "Which structure is used for hierarchical data?",
    options: ["Array", "Queue", "Tree", "Stack"],
    answer: "Tree",
    category: "Data Structure and Algorithms"
  },
  {
    id: 89,
    question: "Which data structure is used in parentheses checking?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    answer: "Stack",
    category: "Data Structure and Algorithms"
  },
  {
    id: 90,
    question: "Which sorting algorithm uses pivot element?",
    options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Insertion Sort"],
    answer: "Quick Sort",
    category: "Data Structure and Algorithms"
  },
  {
    id: 91,
    question: "Which graph can be directed?",
    options: ["Tree", "Undirected Graph", "Directed Graph", "Heap"],
    answer: "Directed Graph",
    category: "Data Structure and Algorithms"
  },
  {
    id: 92,
    question: "Which data structure is best for memory management?",
    options: ["Queue", "Stack", "Heap", "Array"],
    answer: "Heap",
    category: "Data Structure and Algorithms"
  },
  {
    id: 93,
    question: "Which data structure is used in browser back button?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    answer: "Stack",
    category: "Data Structure and Algorithms"
  },
  {
    id: 94,
    question: "Which algorithm is used for cycle detection?",
    options: ["DFS", "BFS", "Dijkstra", "Binary Search"],
    answer: "DFS",
    category: "Data Structure and Algorithms"
  },
  {
    id: 95,
    question: "Which structure stores unique elements efficiently?",
    options: ["Array", "List", "Set", "Queue"],
    answer: "Set",
    category: "Data Structure and Algorithms"
  },
  {
    id: 96,
    question: "Which algorithm is best for small datasets?",
    options: ["Merge Sort", "Quick Sort", "Insertion Sort", "Heap Sort"],
    answer: "Insertion Sort",
    category: "Data Structure and Algorithms"
  },
  {
    id: 97,
    question: "Which data structure is best for fast lookup?",
    options: ["Stack", "Queue", "Hash Table", "Tree"],
    answer: "Hash Table",
    category: "Data Structure and Algorithms"
  },
  {
    id: 98,
    question: "Which operation is not allowed in stack?",
    options: ["Push", "Pop", "Peek", "Random Access"],
    answer: "Random Access",
    category: "Data Structure and Algorithms"
  },
  {
    id: 99,
    question: "Which structure represents relationships between entities?",
    options: ["Array", "Graph", "Stack", "Queue"],
    answer: "Graph",
    category: "Data Structure and Algorithms"
  },
  {
    id: 100,
    question: "Which data structure uses contiguous memory?",
    options: ["Linked List", "Tree", "Array", "Graph"],
    answer: "Array",
    category: "Data Structure and Algorithms"
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
    category: "Database Systems"
  },
  {
    id: 202,
    question: "Which of the following is a DBMS software?",
    options: ["MySQL", "Windows", "Linux", "MS Word"],
    answer: "MySQL",
    category: "Database Systems"
  },
  {
    id: 203,
    question: "Which model organizes data in tables?",
    options: ["Hierarchical", "Network", "Relational", "Object-Oriented"],
    answer: "Relational",
    category: "Database Systems"
  },
  {
    id: 204,
    question: "What is a table in DBMS called?",
    options: ["Entity", "Relation", "Attribute", "Tuple"],
    answer: "Relation",
    category: "Database Systems"
  },
  {
    id: 205,
    question: "What is a row in a table called?",
    options: ["Attribute", "Field", "Tuple", "Column"],
    answer: "Tuple",
    category: "Database Systems"
  },
  {
    id: 206,
    question: "What is a column in a table called?",
    options: ["Tuple", "Relation", "Attribute", "Record"],
    answer: "Attribute",
    category: "Database Systems"
  },
  {
    id: 207,
    question: "Which key uniquely identifies a record?",
    options: ["Foreign key", "Primary key", "Candidate key", "Composite key"],
    answer: "Primary key",
    category: "Database Systems"
  },
  {
    id: 208,
    question: "Which key creates a relationship between tables?",
    options: ["Primary key", "Foreign key", "Super key", "Alternate key"],
    answer: "Foreign key",
    category: "Database Systems"
  },
  {
    id: 209,
    question: "Which language is used to query databases?",
    options: ["HTML", "SQL", "CSS", "Python"],
    answer: "SQL",
    category: "Database Systems"
  },
  {
    id: 210,
    question: "Which SQL command is used to retrieve data?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    answer: "SELECT",
    category: "Database Systems"
  },
  {
    id: 211,
    question: "Which SQL command is used to add new data?",
    options: ["SELECT", "INSERT", "DELETE", "DROP"],
    answer: "INSERT",
    category: "Database Systems"
  },
  {
    id: 212,
    question: "Which SQL command removes data from a table?",
    options: ["DROP", "DELETE", "TRUNCATE", "REMOVE"],
    answer: "DELETE",
    category: "Database Systems"
  },
  {
    id: 213,
    question: "Which SQL command removes a table permanently?",
    options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"],
    answer: "DROP",
    category: "Database Systems"
  },
  {
    id: 214,
    question: "Which command removes all rows but keeps the table structure?",
    options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
    answer: "TRUNCATE",
    category: "Database Systems"
  },
  {
    id: 215,
    question: "Which constraint ensures no duplicate values?",
    options: ["NOT NULL", "CHECK", "UNIQUE", "DEFAULT"],
    answer: "UNIQUE",
    category: "Database Systems"
  },
  {
    id: 216,
    question: "Which constraint prevents NULL values?",
    options: ["UNIQUE", "CHECK", "NOT NULL", "PRIMARY KEY"],
    answer: "NOT NULL",
    category: "Database Systems"
  },
  {
    id: 217,
    question: "Which constraint ensures valid data?",
    options: ["CHECK", "UNIQUE", "DEFAULT", "FOREIGN KEY"],
    answer: "CHECK",
    category: "Database Systems"
  },
  {
    id: 218,
    question: "Which key can have NULL values?",
    options: ["Primary key", "Foreign key", "Super key", "Candidate key"],
    answer: "Foreign key",
    category: "Database Systems"
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
    category: "Database Systems"
  },
  {
    id: 220,
    question: "Which normal form removes partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: "2NF",
    category: "Database Systems"
  },
  {
    id: 221,
    question: "Which normal form removes transitive dependency?",
    options: ["1NF", "2NF", "3NF", "4NF"],
    answer: "3NF",
    category: "Database Systems"
  },
  {
    id: 222,
    question: "Which command modifies existing data?",
    options: ["INSERT", "UPDATE", "SELECT", "DROP"],
    answer: "UPDATE",
    category: "Database Systems"
  },
  {
    id: 223,
    question: "Which clause filters records?",
    options: ["GROUP BY", "ORDER BY", "WHERE", "HAVING"],
    answer: "WHERE",
    category: "Database Systems"
  },
  {
    id: 224,
    question: "Which clause groups records?",
    options: ["WHERE", "ORDER BY", "GROUP BY", "HAVING"],
    answer: "GROUP BY",
    category: "Database Systems"
  },
  {
    id: 225,
    question: "Which clause sorts records?",
    options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"],
    answer: "ORDER BY",
    category: "Database Systems"
  },
  {
    id: 226,
    question: "Which clause filters grouped data?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    answer: "HAVING",
    category: "Database Systems"
  },
  {
    id: 227,
    question: "Which join returns matching records?",
    options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"],
    answer: "INNER JOIN",
    category: "Database Systems"
  },
  {
    id: 228,
    question: "Which join returns all records from left table?",
    options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"],
    answer: "LEFT JOIN",
    category: "Database Systems"
  },
  {
    id: 229,
    question: "Which join returns all records from both tables?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
    answer: "FULL JOIN",
    category: "Database Systems"
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
    category: "Database Systems"
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
    category: "Database Systems"
  },
  {
    id: 232,
    question: "Which command creates a table?",
    options: ["MAKE", "NEW", "CREATE", "BUILD"],
    answer: "CREATE",
    category: "Database Systems"
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
    category: "Database Systems"
  },
  {
    id: 234,
    question: "Which database is NoSQL?",
    options: ["MySQL", "Oracle", "MongoDB", "PostgreSQL"],
    answer: "MongoDB",
    category: "Database Systems"
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
    category: "Database Systems"
  },
  {
    id: 236,
    question: "Which property ensures transactions are permanent?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    answer: "Durability",
    category: "Database Systems"
  },
  {
    id: 237,
    question: "Which property ensures all or nothing execution?",
    options: ["Consistency", "Atomicity", "Isolation", "Durability"],
    answer: "Atomicity",
    category: "Database Systems"
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
    category: "Database Systems"
  },
  {
    id: 239,
    question: "Which command saves a transaction?",
    options: ["SAVE", "COMMIT", "ROLLBACK", "END"],
    answer: "COMMIT",
    category: "Database Systems"
  },
  {
    id: 240,
    question: "Which command undoes a transaction?",
    options: ["UNDO", "ROLLBACK", "CANCEL", "STOP"],
    answer: "ROLLBACK",
    category: "Database Systems"
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
    category: "Database Systems"
  },
  {
    id: 242,
    question: "Which model uses parent-child relationship?",
    options: ["Relational", "Network", "Hierarchical", "Object-Oriented"],
    answer: "Hierarchical",
    category: "Database Systems"
  },
  {
    id: 243,
    question: "Which model allows many-to-many relationships?",
    options: ["Hierarchical", "Relational", "Network", "File system"],
    answer: "Network",
    category: "Database Systems"
  },
  {
    id: 244,
    question: "Which database object stores data physically?",
    options: ["View", "Index", "Table", "Schema"],
    answer: "Table",
    category: "Database Systems"
  },
  {
    id: 245,
    question: "Which command renames a table?",
    options: ["CHANGE", "RENAME", "ALTER", "MODIFY"],
    answer: "ALTER",
    category: "Database Systems"
  },
  {
    id: 246,
    question: "Which SQL function returns total count?",
    options: ["SUM()", "AVG()", "COUNT()", "MAX()"],
    answer: "COUNT()",
    category: "Database Systems"
  },
  {
    id: 247,
    question: "Which SQL function returns average?",
    options: ["AVG()", "SUM()", "COUNT()", "MIN()"],
    answer: "AVG()",
    category: "Database Systems"
  },
  {
    id: 248,
    question: "Which SQL function returns highest value?",
    options: ["MAX()", "MIN()", "SUM()", "COUNT()"],
    answer: "MAX()",
    category: "Database Systems"
  },
  {
    id: 249,
    question: "Which SQL function returns lowest value?",
    options: ["MAX()", "SUM()", "MIN()", "COUNT()"],
    answer: "MIN()",
    category: "Database Systems"
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
    category: "Database Systems"
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
  ,
  {
    id: 351,
    question: "Which of the following is NOT a primitive data type in C?",
    options: ["int", "float", "string", "char"],
    answer: "string",
    category: "Programming Fundamentals"
  },
  {
    id: 352,
    question: "What is the correct syntax to output 'Hello World' in C?",
    options: ["echo('Hello World');", "printf(\"Hello World\");", "print('Hello World');", "cout << 'Hello World';"],
    answer: "printf(\"Hello World\");",
    category: "Programming Fundamentals"
  },
  {
    id: 353,
    question: "Which symbol is used to terminate a statement in C/C++?",
    options: ["Comma (,)", "Period (.)", "Semicolon (;)", "Colon (:)"],
    answer: "Semicolon (;)",
    category: "Programming Fundamentals"
  },
  {
    id: 354,
    question: "What is the value of x after: int x = 5; x += 3;",
    options: ["5", "3", "8", "15"],
    answer: "8",
    category: "Programming Fundamentals"
  },
  {
    id: 355,
    question: "Which loop is guaranteed to execute at least once?",
    options: ["for loop", "while loop", "do-while loop", "foreach loop"],
    answer: "do-while loop",
    category: "Programming Fundamentals"
  },
  {
    id: 356,
    question: "What does the modulus operator (%) return?",
    options: ["The quotient", "The remainder", "The product", "The difference"],
    answer: "The remainder",
    category: "Programming Fundamentals"
  },
  {
    id: 357,
    question: "Which of these is a logical operator?",
    options: ["+", "&&", "=", "%"],
    answer: "&&",
    category: "Programming Fundamentals"
  },
  {
    id: 358,
    question: "What is the size of an int in most modern 32-bit systems?",
    options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
    answer: "4 bytes",
    category: "Programming Fundamentals"
  },
  {
    id: 359,
    question: "Which keyword is used to define a constant in C?",
    options: ["const", "static", "final", "let"],
    answer: "const",
    category: "Programming Fundamentals"
  },
  {
    id: 360,
    question: "What is the index of the first element in an array?",
    options: ["1", "0", "-1", "Depends on language"],
    answer: "0",
    category: "Programming Fundamentals"
  },
  {
    id: 361,
    question: "Which function is the entry point of a C program?",
    options: ["start()", "begin()", "main()", "init()"],
    answer: "main()",
    category: "Programming Fundamentals"
  },
  {
    id: 362,
    question: "What does '++x' do?",
    options: ["Adds 2 to x", "Pre-increments x by 1", "Post-increments x by 1", "Doubles x"],
    answer: "Pre-increments x by 1",
    category: "Programming Fundamentals"
  },
  {
    id: 363,
    question: "Which of the following is a relational operator?",
    options: ["||", "==", "&", "++"],
    answer: "==",
    category: "Programming Fundamentals"
  },
  {
    id: 364,
    question: "What is the result of 10 / 3 in integer arithmetic?",
    options: ["3.33", "3", "4", "3.0"],
    answer: "3",
    category: "Programming Fundamentals"
  },
  {
    id: 365,
    question: "Which function is used to read a string from the keyboard in C?",
    options: ["read()", "scanf()", "input()", "get()"],
    answer: "scanf()",
    category: "Programming Fundamentals"
  },
  {
    id: 366,
    question: "What is a function?",
    options: ["A reusable block of code", "A variable", "A data type", "A loop"],
    answer: "A reusable block of code",
    category: "Programming Fundamentals"
  },
  {
    id: 367,
    question: "Which header file is required for printf and scanf in C?",
    options: ["stdlib.h", "string.h", "stdio.h", "math.h"],
    answer: "stdio.h",
    category: "Programming Fundamentals"
  },
  {
    id: 368,
    question: "What is recursion?",
    options: ["A loop that never ends", "A function calling itself", "A type of variable", "A conditional statement"],
    answer: "A function calling itself",
    category: "Programming Fundamentals"
  },
  {
    id: 369,
    question: "Which symbol is used for single-line comments in C++?",
    options: ["#", "//", "/*", "<!--"],
    answer: "//",
    category: "Programming Fundamentals"
  },
  {
    id: 370,
    question: "What does a 'break' statement do in a loop?",
    options: ["Skips one iteration", "Exits the loop", "Restarts the loop", "Pauses the loop"],
    answer: "Exits the loop",
    category: "Programming Fundamentals"
  },
  {
    id: 371,
    question: "Which of the following is a valid variable name in C?",
    options: ["2num", "num-1", "_num1", "num 1"],
    answer: "_num1",
    category: "Programming Fundamentals"
  },
  {
    id: 372,
    question: "What is a pointer?",
    options: ["A variable that stores a memory address", "A type of array", "A function", "A loop counter"],
    answer: "A variable that stores a memory address",
    category: "Programming Fundamentals"
  },
  {
    id: 373,
    question: "Which operator is used to access the value at a pointer's address?",
    options: ["&", "*", "->", "."],
    answer: "*",
    category: "Programming Fundamentals"
  },
  {
    id: 374,
    question: "What is the output of: if(0) printf(\"A\"); else printf(\"B\");",
    options: ["A", "B", "AB", "Error"],
    answer: "B",
    category: "Programming Fundamentals"
  },
  {
    id: 375,
    question: "Which of the following correctly declares an array of 10 integers?",
    options: ["int arr[10];", "int arr(10);", "array<int> arr[10];", "int arr = [10];"],
    answer: "int arr[10];",
    category: "Programming Fundamentals"
  },
  {
    id: 376,
    question: "What is the difference between '=' and '=='?",
    options: ["No difference", "= assigns, == compares", "= compares, == assigns", "Both compare"],
    answer: "= assigns, == compares",
    category: "Programming Fundamentals"
  },
  {
    id: 377,
    question: "Which keyword is used to skip the current iteration of a loop?",
    options: ["break", "continue", "skip", "pass"],
    answer: "continue",
    category: "Programming Fundamentals"
  },
  {
    id: 378,
    question: "What does 'void' mean as a function return type?",
    options: ["Returns an integer", "Returns nothing", "Returns a pointer", "Returns a string"],
    answer: "Returns nothing",
    category: "Programming Fundamentals"
  },
  {
    id: 379,
    question: "Which of these is a compiled language?",
    options: ["Python", "JavaScript", "C", "Ruby"],
    answer: "C",
    category: "Programming Fundamentals"
  },
  {
    id: 380,
    question: "What is the purpose of a 'return' statement?",
    options: ["To restart the program", "To exit a function and optionally return a value", "To loop back", "To print output"],
    answer: "To exit a function and optionally return a value",
    category: "Programming Fundamentals"
  },
  {
    id: 381,
    question: "What is a flowchart used for?",
    options: ["Storing data", "Visualizing program logic", "Compiling code", "Debugging memory"],
    answer: "Visualizing program logic",
    category: "Programming Fundamentals"
  },
  {
    id: 382,
    question: "Which of these represents pseudocode?",
    options: ["A compiled language", "Informal high-level description of an algorithm", "A type of compiler", "Machine code"],
    answer: "Informal high-level description of an algorithm",
    category: "Programming Fundamentals"
  },
  {
    id: 383,
    question: "What does ASCII stand for?",
    options: ["American Standard Code for Information Interchange", "Advanced System Code for Internal Interfaces", "Automated Software Coding Interface", "Application Standard Code Index"],
    answer: "American Standard Code for Information Interchange",
    category: "Programming Fundamentals"
  },
  {
    id: 384,
    question: "Which of the following is NOT a control structure?",
    options: ["if-else", "while", "switch", "printf"],
    answer: "printf",
    category: "Programming Fundamentals"
  },
  {
    id: 385,
    question: "What is a syntax error?",
    options: ["A logical mistake", "An error in the rules of the language", "A runtime error", "A memory leak"],
    answer: "An error in the rules of the language",
    category: "Programming Fundamentals"
  },
  {
    id: 386,
    question: "Which of these data types stores a single character?",
    options: ["int", "char", "float", "bool"],
    answer: "char",
    category: "Programming Fundamentals"
  },
  {
    id: 387,
    question: "What is type casting?",
    options: ["Converting one data type to another", "Declaring a variable", "Creating a function", "Importing a library"],
    answer: "Converting one data type to another",
    category: "Programming Fundamentals"
  },
  {
    id: 388,
    question: "Which loop is best when the number of iterations is known?",
    options: ["while", "do-while", "for", "infinite"],
    answer: "for",
    category: "Programming Fundamentals"
  },
  {
    id: 389,
    question: "What is the output of: int x = 5; printf(\"%d\", x++);",
    options: ["5", "6", "7", "Error"],
    answer: "5",
    category: "Programming Fundamentals"
  },
  {
    id: 390,
    question: "Which keyword is used to allocate memory dynamically in C?",
    options: ["new", "malloc", "alloc", "create"],
    answer: "malloc",
    category: "Programming Fundamentals"
  },
  {
    id: 391,
    question: "What does the function 'free()' do in C?",
    options: ["Allocates memory", "Releases dynamically allocated memory", "Closes a file", "Exits the program"],
    answer: "Releases dynamically allocated memory",
    category: "Programming Fundamentals"
  },
  {
    id: 392,
    question: "What is the difference between local and global variables?",
    options: ["No difference", "Local is accessible only within its block; global is accessible throughout the program", "Global is faster", "Local lives forever"],
    answer: "Local is accessible only within its block; global is accessible throughout the program",
    category: "Programming Fundamentals"
  },
  {
    id: 393,
    question: "Which of these is the correct way to comment multiple lines in C?",
    options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"],
    answer: "/* comment */",
    category: "Programming Fundamentals"
  },
  {
    id: 394,
    question: "What is a string in C?",
    options: ["An integer array", "A character array ending with '\\0'", "A pointer", "A function"],
    answer: "A character array ending with '\\0'",
    category: "Programming Fundamentals"
  },
  {
    id: 395,
    question: "Which operator has the highest precedence?",
    options: ["+", "*", "()", "&&"],
    answer: "()",
    category: "Programming Fundamentals"
  },
  {
    id: 396,
    question: "What is debugging?",
    options: ["Writing code", "Finding and fixing errors in code", "Deleting code", "Running code"],
    answer: "Finding and fixing errors in code",
    category: "Programming Fundamentals"
  },
  {
    id: 397,
    question: "Which sorting algorithm is the simplest to implement?",
    options: ["Quick sort", "Bubble sort", "Merge sort", "Heap sort"],
    answer: "Bubble sort",
    category: "Programming Fundamentals"
  },
  {
    id: 398,
    question: "What is an algorithm?",
    options: ["A programming language", "A step-by-step procedure to solve a problem", "A type of computer", "A hardware component"],
    answer: "A step-by-step procedure to solve a problem",
    category: "Programming Fundamentals"
  },
  {
    id: 399,
    question: "Which of these is a low-level language?",
    options: ["Python", "Assembly", "Java", "C#"],
    answer: "Assembly",
    category: "Programming Fundamentals"
  },
  {
    id: 400,
    question: "What is the role of a compiler?",
    options: ["Run programs", "Translate source code into machine code", "Edit code", "Store data"],
    answer: "Translate source code into machine code",
    category: "Programming Fundamentals"
  },
  {
    id: 401,
    question: "What is the cardinality of a set?",
    options: ["The number of subsets", "The number of elements in the set", "The largest element", "The sum of elements"],
    answer: "The number of elements in the set",
    category: "Discrete Structures"
  },
  {
    id: 402,
    question: "Which symbol denotes 'element of'?",
    options: ["⊆", "∈", "∪", "∩"],
    answer: "∈",
    category: "Discrete Structures"
  },
  {
    id: 403,
    question: "What is the union of {1,2} and {2,3}?",
    options: ["{2}", "{1,3}", "{1,2,3}", "{1,2,2,3}"],
    answer: "{1,2,3}",
    category: "Discrete Structures"
  },
  {
    id: 404,
    question: "What is the intersection of {a,b,c} and {b,c,d}?",
    options: ["{a,d}", "{b,c}", "{a,b,c,d}", "Empty set"],
    answer: "{b,c}",
    category: "Discrete Structures"
  },
  {
    id: 405,
    question: "What does the empty set contain?",
    options: ["Zero", "One element", "No elements", "Infinite elements"],
    answer: "No elements",
    category: "Discrete Structures"
  },
  {
    id: 406,
    question: "How many subsets does a set with n elements have?",
    options: ["n", "n²", "2^n", "n!"],
    answer: "2^n",
    category: "Discrete Structures"
  },
  {
    id: 407,
    question: "What is a proposition in logic?",
    options: ["A question", "A declarative statement that is either true or false", "A command", "A variable"],
    answer: "A declarative statement that is either true or false",
    category: "Discrete Structures"
  },
  {
    id: 408,
    question: "What is the truth value of (T AND F)?",
    options: ["True", "False", "Both", "Undefined"],
    answer: "False",
    category: "Discrete Structures"
  },
  {
    id: 409,
    question: "What is the truth value of (T OR F)?",
    options: ["True", "False", "Both", "Undefined"],
    answer: "True",
    category: "Discrete Structures"
  },
  {
    id: 410,
    question: "What is the negation of 'x is even'?",
    options: ["x is positive", "x is odd", "x is zero", "x is negative"],
    answer: "x is odd",
    category: "Discrete Structures"
  },
  {
    id: 411,
    question: "What is De Morgan's Law for sets?",
    options: ["(A∪B)' = A' ∩ B'", "(A∪B)' = A' ∪ B'", "(A∩B)' = A ∩ B", "(A∪B) = A ∩ B"],
    answer: "(A∪B)' = A' ∩ B'",
    category: "Discrete Structures"
  },
  {
    id: 412,
    question: "A relation R is reflexive if:",
    options: ["aRb implies bRa", "(a,a) ∈ R for all a", "aRb and bRc imply aRc", "R is empty"],
    answer: "(a,a) ∈ R for all a",
    category: "Discrete Structures"
  },
  {
    id: 413,
    question: "A relation R is symmetric if:",
    options: ["aRb implies bRa", "aRa for all a", "aRb and bRc imply aRc", "R is full"],
    answer: "aRb implies bRa",
    category: "Discrete Structures"
  },
  {
    id: 414,
    question: "A relation R is transitive if:",
    options: ["aRb implies bRa", "aRa for all a", "aRb and bRc imply aRc", "R is empty"],
    answer: "aRb and bRc imply aRc",
    category: "Discrete Structures"
  },
  {
    id: 415,
    question: "What is an equivalence relation?",
    options: ["Only reflexive", "Reflexive, symmetric, and transitive", "Only symmetric", "Only transitive"],
    answer: "Reflexive, symmetric, and transitive",
    category: "Discrete Structures"
  },
  {
    id: 416,
    question: "What is a function?",
    options: ["A relation where each input has exactly one output", "Any subset of A×B", "A reflexive relation", "An undirected graph"],
    answer: "A relation where each input has exactly one output",
    category: "Discrete Structures"
  },
  {
    id: 417,
    question: "A function f: A → B is one-to-one (injective) if:",
    options: ["Every element of B has a preimage", "Different inputs give different outputs", "f is constant", "A is finite"],
    answer: "Different inputs give different outputs",
    category: "Discrete Structures"
  },
  {
    id: 418,
    question: "A function f: A → B is onto (surjective) if:",
    options: ["Every element of B has a preimage in A", "Every element of A maps to itself", "f is one-to-one", "A and B are equal"],
    answer: "Every element of B has a preimage in A",
    category: "Discrete Structures"
  },
  {
    id: 419,
    question: "What is the value of 5! (5 factorial)?",
    options: ["25", "120", "60", "100"],
    answer: "120",
    category: "Discrete Structures"
  },
  {
    id: 420,
    question: "How many ways can you arrange 4 distinct objects?",
    options: ["4", "16", "12", "24"],
    answer: "24",
    category: "Discrete Structures"
  },
  {
    id: 421,
    question: "What is C(5,2) (combinations of 5 things taken 2 at a time)?",
    options: ["10", "20", "5", "25"],
    answer: "10",
    category: "Discrete Structures"
  },
  {
    id: 422,
    question: "What is P(5,2) (permutations of 5 things taken 2 at a time)?",
    options: ["10", "20", "5", "25"],
    answer: "20",
    category: "Discrete Structures"
  },
  {
    id: 423,
    question: "What is a graph in discrete math?",
    options: ["A chart of data", "A set of vertices connected by edges", "A function plot", "A type of equation"],
    answer: "A set of vertices connected by edges",
    category: "Discrete Structures"
  },
  {
    id: 424,
    question: "What is a directed graph?",
    options: ["A graph with no edges", "A graph where edges have direction", "A complete graph", "A tree"],
    answer: "A graph where edges have direction",
    category: "Discrete Structures"
  },
  {
    id: 425,
    question: "What is the degree of a vertex?",
    options: ["Its label", "The number of edges incident to it", "Its position", "The shortest path from it"],
    answer: "The number of edges incident to it",
    category: "Discrete Structures"
  },
  {
    id: 426,
    question: "What is a tree?",
    options: ["A connected acyclic graph", "Any graph with cycles", "A complete graph", "A bipartite graph"],
    answer: "A connected acyclic graph",
    category: "Discrete Structures"
  },
  {
    id: 427,
    question: "How many edges does a tree with n vertices have?",
    options: ["n", "n-1", "n+1", "2n"],
    answer: "n-1",
    category: "Discrete Structures"
  },
  {
    id: 428,
    question: "What is a complete graph Kn?",
    options: ["A graph with no edges", "A graph where every pair of vertices is connected", "A tree", "A disconnected graph"],
    answer: "A graph where every pair of vertices is connected",
    category: "Discrete Structures"
  },
  {
    id: 429,
    question: "What is a bipartite graph?",
    options: ["A graph with two vertices", "A graph whose vertices can be divided into two disjoint sets with edges only between sets", "A complete graph", "A graph with cycles"],
    answer: "A graph whose vertices can be divided into two disjoint sets with edges only between sets",
    category: "Discrete Structures"
  },
  {
    id: 430,
    question: "What is mathematical induction used for?",
    options: ["Solving equations", "Proving statements for all natural numbers", "Counting elements", "Building graphs"],
    answer: "Proving statements for all natural numbers",
    category: "Discrete Structures"
  },
  {
    id: 431,
    question: "The contrapositive of 'If P then Q' is:",
    options: ["If Q then P", "If not P then not Q", "If not Q then not P", "P and Q"],
    answer: "If not Q then not P",
    category: "Discrete Structures"
  },
  {
    id: 432,
    question: "The converse of 'If P then Q' is:",
    options: ["If Q then P", "If not P then not Q", "If not Q then not P", "Not P or Q"],
    answer: "If Q then P",
    category: "Discrete Structures"
  },
  {
    id: 433,
    question: "Which of the following is a tautology?",
    options: ["P AND NOT P", "P OR NOT P", "P AND P", "NOT P"],
    answer: "P OR NOT P",
    category: "Discrete Structures"
  },
  {
    id: 434,
    question: "Which is a contradiction?",
    options: ["P OR NOT P", "P AND NOT P", "P AND P", "P OR P"],
    answer: "P AND NOT P",
    category: "Discrete Structures"
  },
  {
    id: 435,
    question: "What does the universal quantifier ∀ mean?",
    options: ["There exists", "For all", "Not", "Implies"],
    answer: "For all",
    category: "Discrete Structures"
  },
  {
    id: 436,
    question: "What does the existential quantifier ∃ mean?",
    options: ["For all", "There exists", "Not", "Implies"],
    answer: "There exists",
    category: "Discrete Structures"
  },
  {
    id: 437,
    question: "What is gcd(12, 18)?",
    options: ["2", "3", "6", "12"],
    answer: "6",
    category: "Discrete Structures"
  },
  {
    id: 438,
    question: "What is lcm(4, 6)?",
    options: ["12", "24", "10", "2"],
    answer: "12",
    category: "Discrete Structures"
  },
  {
    id: 439,
    question: "Which of the following is a prime number?",
    options: ["1", "9", "11", "15"],
    answer: "11",
    category: "Discrete Structures"
  },
  {
    id: 440,
    question: "What is the binary representation of decimal 10?",
    options: ["1010", "1100", "1001", "1110"],
    answer: "1010",
    category: "Discrete Structures"
  },
  {
    id: 441,
    question: "What is 2^5?",
    options: ["10", "25", "32", "16"],
    answer: "32",
    category: "Discrete Structures"
  },
  {
    id: 442,
    question: "A power set of {a, b} is:",
    options: ["{a, b}", "{∅, {a}, {b}, {a,b}}", "{{a}, {b}}", "{∅}"],
    answer: "{∅, {a}, {b}, {a,b}}",
    category: "Discrete Structures"
  },
  {
    id: 443,
    question: "What is the size of the power set of a set with 4 elements?",
    options: ["4", "8", "16", "32"],
    answer: "16",
    category: "Discrete Structures"
  },
  {
    id: 444,
    question: "What is a Cartesian product A × B?",
    options: ["The set of all subsets of A and B", "The set of ordered pairs (a,b) where a ∈ A and b ∈ B", "The intersection of A and B", "The difference A - B"],
    answer: "The set of ordered pairs (a,b) where a ∈ A and b ∈ B",
    category: "Discrete Structures"
  },
  {
    id: 445,
    question: "Which logical operator is also called 'implication'?",
    options: ["AND", "OR", "→", "XOR"],
    answer: "→",
    category: "Discrete Structures"
  },
  {
    id: 446,
    question: "What is a Boolean variable?",
    options: ["A real number", "A variable that takes values 0 or 1 (true/false)", "A string", "An array"],
    answer: "A variable that takes values 0 or 1 (true/false)",
    category: "Discrete Structures"
  },
  {
    id: 447,
    question: "What is a recurrence relation?",
    options: ["A function defined for negative numbers", "A sequence where each term is defined using previous terms", "A type of equation", "A graph property"],
    answer: "A sequence where each term is defined using previous terms",
    category: "Discrete Structures"
  },
  {
    id: 448,
    question: "The Fibonacci sequence starts: 0, 1, 1, 2, 3, 5, 8... What is the next number?",
    options: ["10", "11", "13", "16"],
    answer: "13",
    category: "Discrete Structures"
  },
  {
    id: 449,
    question: "Pigeonhole Principle states:",
    options: ["Items can fit in any holes", "If n items go into m holes and n > m, at least one hole has 2 items", "All holes are equal", "Items must be sorted"],
    answer: "If n items go into m holes and n > m, at least one hole has 2 items",
    category: "Discrete Structures"
  },
  {
    id: 450,
    question: "An Eulerian circuit visits:",
    options: ["Every vertex exactly once", "Every edge exactly once and returns to start", "Some edges twice", "Only odd-degree vertices"],
    answer: "Every edge exactly once and returns to start",
    category: "Discrete Structures"
  },
  {
    id: 451,
    question: "What is the primary function of an operating system?",
    options: ["To compile code", "To manage hardware and software resources", "To browse the internet", "To create documents"],
    answer: "To manage hardware and software resources",
    category: "Operating Systems"
  },
  {
    id: 452,
    question: "Which of the following is NOT an operating system?",
    options: ["Linux", "Oracle", "Windows", "macOS"],
    answer: "Oracle",
    category: "Operating Systems"
  },
  {
    id: 453,
    question: "What is a process?",
    options: ["A program in execution", "A file on disk", "A hardware device", "A network packet"],
    answer: "A program in execution",
    category: "Operating Systems"
  },
  {
    id: 454,
    question: "What is a thread?",
    options: ["A separate process", "The smallest unit of execution within a process", "A file pointer", "A network connection"],
    answer: "The smallest unit of execution within a process",
    category: "Operating Systems"
  },
  {
    id: 455,
    question: "Which scheduling algorithm gives priority to the shortest job first?",
    options: ["FCFS", "SJF", "Round Robin", "Priority"],
    answer: "SJF",
    category: "Operating Systems"
  },
  {
    id: 456,
    question: "What does FCFS stand for?",
    options: ["First-Come, First-Served", "Fast Computing for Storage", "Fixed Cost File System", "File Cache Service"],
    answer: "First-Come, First-Served",
    category: "Operating Systems"
  },
  {
    id: 457,
    question: "What is a deadlock?",
    options: ["A locked file", "A situation where two or more processes wait indefinitely for each other's resources", "A failed CPU", "A memory leak"],
    answer: "A situation where two or more processes wait indefinitely for each other's resources",
    category: "Operating Systems"
  },
  {
    id: 458,
    question: "Which of these is NOT a necessary condition for deadlock?",
    options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"],
    answer: "Preemption",
    category: "Operating Systems"
  },
  {
    id: 459,
    question: "What is virtual memory?",
    options: ["RAM only", "A technique that uses disk space to extend RAM", "Cache memory", "ROM"],
    answer: "A technique that uses disk space to extend RAM",
    category: "Operating Systems"
  },
  {
    id: 460,
    question: "What is paging?",
    options: ["A printing process", "A memory management scheme that eliminates external fragmentation", "A scheduling algorithm", "A file system"],
    answer: "A memory management scheme that eliminates external fragmentation",
    category: "Operating Systems"
  },
  {
    id: 461,
    question: "What is segmentation in OS?",
    options: ["Splitting hard drives", "Dividing memory into variable-sized logical segments", "A scheduling method", "A file backup"],
    answer: "Dividing memory into variable-sized logical segments",
    category: "Operating Systems"
  },
  {
    id: 462,
    question: "What is a semaphore?",
    options: ["A type of file", "A synchronization variable used to control access to shared resources", "A memory address", "An interrupt"],
    answer: "A synchronization variable used to control access to shared resources",
    category: "Operating Systems"
  },
  {
    id: 463,
    question: "What is a system call?",
    options: ["A phone call to support", "An interface between user programs and the OS kernel", "A network call", "A function call"],
    answer: "An interface between user programs and the OS kernel",
    category: "Operating Systems"
  },
  {
    id: 464,
    question: "Which of these is a Unix-based OS?",
    options: ["Windows 10", "DOS", "Linux", "OS/2"],
    answer: "Linux",
    category: "Operating Systems"
  },
  {
    id: 465,
    question: "What is the kernel?",
    options: ["The shell of OS", "The core component of an OS that manages system resources", "A type of disk", "A boot loader only"],
    answer: "The core component of an OS that manages system resources",
    category: "Operating Systems"
  },
  {
    id: 466,
    question: "What does Round Robin scheduling use?",
    options: ["Priority", "Time slices (quantum)", "Job length", "Random selection"],
    answer: "Time slices (quantum)",
    category: "Operating Systems"
  },
  {
    id: 467,
    question: "What is thrashing?",
    options: ["Heavy CPU usage", "Excessive paging activity that severely degrades performance", "Disk corruption", "A type of attack"],
    answer: "Excessive paging activity that severely degrades performance",
    category: "Operating Systems"
  },
  {
    id: 468,
    question: "Which file system does Windows NT use?",
    options: ["FAT32", "NTFS", "ext4", "HFS"],
    answer: "NTFS",
    category: "Operating Systems"
  },
  {
    id: 469,
    question: "What is a context switch?",
    options: ["Changing user accounts", "Saving the state of one process and loading another's", "A keyboard shortcut", "A boot operation"],
    answer: "Saving the state of one process and loading another's",
    category: "Operating Systems"
  },
  {
    id: 470,
    question: "Which is NOT a process state?",
    options: ["Ready", "Running", "Waiting", "Compiled"],
    answer: "Compiled",
    category: "Operating Systems"
  },
  {
    id: 471,
    question: "What is the purpose of an interrupt?",
    options: ["To stop the system", "To signal the CPU to handle an event needing immediate attention", "To slow down processes", "To clear memory"],
    answer: "To signal the CPU to handle an event needing immediate attention",
    category: "Operating Systems"
  },
  {
    id: 472,
    question: "What is a mutex?",
    options: ["A multi-user file", "A mutual exclusion lock for thread synchronization", "A processor", "A memory chip"],
    answer: "A mutual exclusion lock for thread synchronization",
    category: "Operating Systems"
  },
  {
    id: 473,
    question: "What does PCB stand for in operating systems?",
    options: ["Process Control Block", "Printed Circuit Board", "Program Counter Buffer", "Process Cache Block"],
    answer: "Process Control Block",
    category: "Operating Systems"
  },
  {
    id: 474,
    question: "What is Banker's Algorithm used for?",
    options: ["Encryption", "Deadlock avoidance", "Scheduling", "Memory paging"],
    answer: "Deadlock avoidance",
    category: "Operating Systems"
  },
  {
    id: 475,
    question: "Which of the following is NOT a page replacement algorithm?",
    options: ["FIFO", "LRU", "Optimal", "SSTF"],
    answer: "SSTF",
    category: "Operating Systems"
  },
  {
    id: 476,
    question: "SSTF is a:",
    options: ["Page replacement algorithm", "Disk scheduling algorithm", "CPU scheduling algorithm", "Memory allocation algorithm"],
    answer: "Disk scheduling algorithm",
    category: "Operating Systems"
  },
  {
    id: 477,
    question: "What is a zombie process?",
    options: ["A process that has completed but still has an entry in the process table", "A malicious process", "A high-priority process", "An interrupt handler"],
    answer: "A process that has completed but still has an entry in the process table",
    category: "Operating Systems"
  },
  {
    id: 478,
    question: "Which command lists files in Linux?",
    options: ["dir", "ls", "list", "show"],
    answer: "ls",
    category: "Operating Systems"
  },
  {
    id: 479,
    question: "Which command in Linux is used to change file permissions?",
    options: ["chperm", "chmod", "chown", "permit"],
    answer: "chmod",
    category: "Operating Systems"
  },
  {
    id: 480,
    question: "What does 'fork()' do in Unix?",
    options: ["Closes a process", "Creates a new child process", "Swaps memory", "Reboots the system"],
    answer: "Creates a new child process",
    category: "Operating Systems"
  },
  {
    id: 481,
    question: "What is multitasking?",
    options: ["Using multiple computers", "Executing multiple processes seemingly simultaneously", "Working in shifts", "Sharing a CPU with one process"],
    answer: "Executing multiple processes seemingly simultaneously",
    category: "Operating Systems"
  },
  {
    id: 482,
    question: "What is the difference between preemptive and non-preemptive scheduling?",
    options: ["No difference", "Preemptive can interrupt running processes; non-preemptive cannot", "Non-preemptive is faster", "Preemptive only works on one CPU"],
    answer: "Preemptive can interrupt running processes; non-preemptive cannot",
    category: "Operating Systems"
  },
  {
    id: 483,
    question: "What is shell in OS?",
    options: ["A type of disk", "The interface between the user and the kernel", "Hardware enclosure", "A driver"],
    answer: "The interface between the user and the kernel",
    category: "Operating Systems"
  },
  {
    id: 484,
    question: "Which scheduling algorithm can cause starvation?",
    options: ["Round Robin", "FCFS", "SJF (without aging)", "All do"],
    answer: "SJF (without aging)",
    category: "Operating Systems"
  },
  {
    id: 485,
    question: "What is a real-time operating system (RTOS)?",
    options: ["An OS for games only", "An OS designed to process data within strict time constraints", "An OS without GUI", "An OS for live streaming"],
    answer: "An OS designed to process data within strict time constraints",
    category: "Operating Systems"
  },
  {
    id: 486,
    question: "What does DMA stand for?",
    options: ["Direct Memory Access", "Dynamic Memory Allocation", "Distributed Multi Access", "Data Management Area"],
    answer: "Direct Memory Access",
    category: "Operating Systems"
  },
  {
    id: 487,
    question: "What is a daemon?",
    options: ["A virus", "A background process that runs without user interaction", "A boot file", "A type of shell"],
    answer: "A background process that runs without user interaction",
    category: "Operating Systems"
  },
  {
    id: 488,
    question: "What is BIOS?",
    options: ["A hard drive", "Basic Input/Output System firmware that initializes hardware at boot", "A device driver", "An OS"],
    answer: "Basic Input/Output System firmware that initializes hardware at boot",
    category: "Operating Systems"
  },
  {
    id: 489,
    question: "What is a swap space?",
    options: ["Storage that extends RAM by holding inactive memory pages on disk", "Backup memory", "Cache", "Read-only memory"],
    answer: "Storage that extends RAM by holding inactive memory pages on disk",
    category: "Operating Systems"
  },
  {
    id: 490,
    question: "Which Linux command shows running processes?",
    options: ["ps", "list", "show", "run"],
    answer: "ps",
    category: "Operating Systems"
  },
  {
    id: 491,
    question: "What is the page fault?",
    options: ["A faulty page in a book", "An event that occurs when a program accesses a page not in main memory", "A scheduling issue", "A disk error"],
    answer: "An event that occurs when a program accesses a page not in main memory",
    category: "Operating Systems"
  },
  {
    id: 492,
    question: "Which is the highest priority interrupt?",
    options: ["I/O interrupt", "Software interrupt", "Hardware reset / NMI", "Timer interrupt"],
    answer: "Hardware reset / NMI",
    category: "Operating Systems"
  },
  {
    id: 493,
    question: "What is fragmentation?",
    options: ["Encryption", "Inefficient use of memory due to scattered free blocks", "A scheduling algorithm", "A file format"],
    answer: "Inefficient use of memory due to scattered free blocks",
    category: "Operating Systems"
  },
  {
    id: 494,
    question: "What is a process control block (PCB) used for?",
    options: ["Storing user data", "Storing process state and metadata for the OS", "Storing source code", "Storing network packets"],
    answer: "Storing process state and metadata for the OS",
    category: "Operating Systems"
  },
  {
    id: 495,
    question: "What does IPC stand for?",
    options: ["Internal Program Counter", "Inter-Process Communication", "Independent Process Control", "Internet Protocol Cache"],
    answer: "Inter-Process Communication",
    category: "Operating Systems"
  },
  {
    id: 496,
    question: "Which IPC mechanism allows processes to share memory regions?",
    options: ["Pipes", "Shared memory", "Signals", "Sockets"],
    answer: "Shared memory",
    category: "Operating Systems"
  },
  {
    id: 497,
    question: "What is the difference between user mode and kernel mode?",
    options: ["No difference", "Kernel mode has full hardware access; user mode is restricted", "User mode is faster", "Kernel mode is for graphics only"],
    answer: "Kernel mode has full hardware access; user mode is restricted",
    category: "Operating Systems"
  },
  {
    id: 498,
    question: "What is a microkernel?",
    options: ["A small CPU", "A kernel design with minimal core, services run in user space", "A virtualization tool", "A boot loader"],
    answer: "A kernel design with minimal core, services run in user space",
    category: "Operating Systems"
  },
  {
    id: 499,
    question: "What is a monolithic kernel?",
    options: ["A kernel where all OS services run in kernel space", "A user-space service", "A type of file system", "An interrupt"],
    answer: "A kernel where all OS services run in kernel space",
    category: "Operating Systems"
  },
  {
    id: 500,
    question: "Which file system is commonly used by Linux?",
    options: ["NTFS", "ext4", "FAT32", "HFS+"],
    answer: "ext4",
    category: "Operating Systems"
  },
  {
    id: 501,
    question: "What is software engineering?",
    options: ["The art of typing code fast", "A systematic approach to designing, developing, and maintaining software", "Hardware design", "Only debugging"],
    answer: "A systematic approach to designing, developing, and maintaining software",
    category: "Software Engineering"
  },
  {
    id: 502,
    question: "Which is NOT a phase of the SDLC?",
    options: ["Requirement Analysis", "Design", "Cooking", "Testing"],
    answer: "Cooking",
    category: "Software Engineering"
  },
  {
    id: 503,
    question: "What does SDLC stand for?",
    options: ["Software Development Life Cycle", "System Design Logic Cycle", "Standard Database Logic Code", "Server Data Lookup Channel"],
    answer: "Software Development Life Cycle",
    category: "Software Engineering"
  },
  {
    id: 504,
    question: "Which SDLC model is sequential and rigid?",
    options: ["Agile", "Waterfall", "Spiral", "Prototyping"],
    answer: "Waterfall",
    category: "Software Engineering"
  },
  {
    id: 505,
    question: "Which SDLC model emphasizes iterations and customer feedback?",
    options: ["Waterfall", "Agile", "V-model", "Big Bang"],
    answer: "Agile",
    category: "Software Engineering"
  },
  {
    id: 506,
    question: "What is a Sprint in Scrum?",
    options: ["A run", "A fixed-length iteration, typically 2-4 weeks, of work", "A bug fix", "A meeting"],
    answer: "A fixed-length iteration, typically 2-4 weeks, of work",
    category: "Software Engineering"
  },
  {
    id: 507,
    question: "Who is the Product Owner in Scrum?",
    options: ["A developer", "The person responsible for prioritizing the product backlog", "The CEO", "The QA tester"],
    answer: "The person responsible for prioritizing the product backlog",
    category: "Software Engineering"
  },
  {
    id: 508,
    question: "What is a user story?",
    options: ["A novel", "A short description of a feature from the user's perspective", "A bug report", "A test case"],
    answer: "A short description of a feature from the user's perspective",
    category: "Software Engineering"
  },
  {
    id: 509,
    question: "What is the goal of Test-Driven Development (TDD)?",
    options: ["Skip testing", "Write tests before writing the code", "Test only at the end", "Manual testing only"],
    answer: "Write tests before writing the code",
    category: "Software Engineering"
  },
  {
    id: 510,
    question: "What is unit testing?",
    options: ["Testing the entire system", "Testing individual components/functions in isolation", "User acceptance testing", "Performance testing"],
    answer: "Testing individual components/functions in isolation",
    category: "Software Engineering"
  },
  {
    id: 511,
    question: "What is integration testing?",
    options: ["Testing one function", "Testing combined components to verify they work together", "Compiling code", "Designing UI"],
    answer: "Testing combined components to verify they work together",
    category: "Software Engineering"
  },
  {
    id: 512,
    question: "What is regression testing?",
    options: ["Testing only old features", "Re-testing after changes to ensure existing functionality still works", "Stress testing", "Load testing"],
    answer: "Re-testing after changes to ensure existing functionality still works",
    category: "Software Engineering"
  },
  {
    id: 513,
    question: "What is a use case diagram?",
    options: ["A class diagram", "A UML diagram showing actors and their interactions with the system", "A flowchart", "An ER diagram"],
    answer: "A UML diagram showing actors and their interactions with the system",
    category: "Software Engineering"
  },
  {
    id: 514,
    question: "What does UML stand for?",
    options: ["Unified Modeling Language", "Universal Markup Language", "Unique Module Loader", "User Modeling Logic"],
    answer: "Unified Modeling Language",
    category: "Software Engineering"
  },
  {
    id: 515,
    question: "Which is NOT a UML diagram?",
    options: ["Class diagram", "Sequence diagram", "Pie chart", "Activity diagram"],
    answer: "Pie chart",
    category: "Software Engineering"
  },
  {
    id: 516,
    question: "What is software architecture?",
    options: ["Wiring diagrams", "The high-level structure of a software system", "Database design", "Code style"],
    answer: "The high-level structure of a software system",
    category: "Software Engineering"
  },
  {
    id: 517,
    question: "Which is a software design principle?",
    options: ["DRY (Don't Repeat Yourself)", "Copy-paste everywhere", "Hardcode everything", "Skip documentation"],
    answer: "DRY (Don't Repeat Yourself)",
    category: "Software Engineering"
  },
  {
    id: 518,
    question: "What does SOLID stand for in OOP design?",
    options: ["A type of database", "Five design principles for object-oriented design", "A programming language", "A testing framework"],
    answer: "Five design principles for object-oriented design",
    category: "Software Engineering"
  },
  {
    id: 519,
    question: "What is coupling in software design?",
    options: ["Pairing developers", "The degree of interdependence between modules", "Joining databases", "Network traffic"],
    answer: "The degree of interdependence between modules",
    category: "Software Engineering"
  },
  {
    id: 520,
    question: "What is cohesion?",
    options: ["Adhesion of code", "How closely related the responsibilities of a module are", "Coupling between modules", "Compilation order"],
    answer: "How closely related the responsibilities of a module are",
    category: "Software Engineering"
  },
  {
    id: 521,
    question: "Good software design has:",
    options: ["High coupling and low cohesion", "Low coupling and high cohesion", "High coupling and high cohesion", "No structure"],
    answer: "Low coupling and high cohesion",
    category: "Software Engineering"
  },
  {
    id: 522,
    question: "What is a design pattern?",
    options: ["A coding style", "A reusable solution to a common design problem", "A UI mockup", "A naming convention"],
    answer: "A reusable solution to a common design problem",
    category: "Software Engineering"
  },
  {
    id: 523,
    question: "Which is a creational design pattern?",
    options: ["Observer", "Singleton", "Adapter", "Strategy"],
    answer: "Singleton",
    category: "Software Engineering"
  },
  {
    id: 524,
    question: "Which is a structural design pattern?",
    options: ["Factory", "Adapter", "Observer", "Command"],
    answer: "Adapter",
    category: "Software Engineering"
  },
  {
    id: 525,
    question: "Which is a behavioral design pattern?",
    options: ["Singleton", "Adapter", "Observer", "Builder"],
    answer: "Observer",
    category: "Software Engineering"
  },
  {
    id: 526,
    question: "What is refactoring?",
    options: ["Adding new features", "Restructuring existing code without changing its external behavior", "Deleting code", "Writing tests"],
    answer: "Restructuring existing code without changing its external behavior",
    category: "Software Engineering"
  },
  {
    id: 527,
    question: "What is technical debt?",
    options: ["Money owed to vendors", "Cost of additional rework caused by choosing easy solutions over better ones", "Hardware cost", "Salary debts"],
    answer: "Cost of additional rework caused by choosing easy solutions over better ones",
    category: "Software Engineering"
  },
  {
    id: 528,
    question: "Which is a version control system?",
    options: ["Git", "Photoshop", "Excel", "Outlook"],
    answer: "Git",
    category: "Software Engineering"
  },
  {
    id: 529,
    question: "What does CI/CD stand for?",
    options: ["Code Inspector / Code Debugger", "Continuous Integration / Continuous Deployment", "Centralized Index / Centralized Database", "Custom Interface / Custom Design"],
    answer: "Continuous Integration / Continuous Deployment",
    category: "Software Engineering"
  },
  {
    id: 530,
    question: "What is white-box testing?",
    options: ["Testing without code knowledge", "Testing based on internal code structure", "User testing", "Performance testing"],
    answer: "Testing based on internal code structure",
    category: "Software Engineering"
  },
  {
    id: 531,
    question: "What is black-box testing?",
    options: ["Testing without knowledge of internal implementation", "Testing only the GUI", "Code review", "Compiler testing"],
    answer: "Testing without knowledge of internal implementation",
    category: "Software Engineering"
  },
  {
    id: 532,
    question: "What is alpha testing?",
    options: ["Testing by end users", "Testing performed in-house by developers/QA before release", "Performance testing", "Security testing"],
    answer: "Testing performed in-house by developers/QA before release",
    category: "Software Engineering"
  },
  {
    id: 533,
    question: "What is beta testing?",
    options: ["Internal testing", "Testing by a limited group of external users before public release", "Compiler testing", "Code review"],
    answer: "Testing by a limited group of external users before public release",
    category: "Software Engineering"
  },
  {
    id: 534,
    question: "What does MVP mean in product development?",
    options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Verified Process", "Model View Presenter"],
    answer: "Minimum Viable Product",
    category: "Software Engineering"
  },
  {
    id: 535,
    question: "What is a stakeholder?",
    options: ["A developer only", "Any person/group with interest in or affected by the project", "A QA tester", "A vendor"],
    answer: "Any person/group with interest in or affected by the project",
    category: "Software Engineering"
  },
  {
    id: 536,
    question: "What is the V-model?",
    options: ["A version control method", "An SDLC where each development phase has a corresponding testing phase", "A pricing model", "An agile framework"],
    answer: "An SDLC where each development phase has a corresponding testing phase",
    category: "Software Engineering"
  },
  {
    id: 537,
    question: "What does DevOps emphasize?",
    options: ["Separation of dev and ops", "Collaboration between development and operations teams", "Outsourcing", "Manual deployment"],
    answer: "Collaboration between development and operations teams",
    category: "Software Engineering"
  },
  {
    id: 538,
    question: "What is a code review?",
    options: ["Code execution", "Systematic examination of source code by peers", "Compiling", "Auto-formatting"],
    answer: "Systematic examination of source code by peers",
    category: "Software Engineering"
  },
  {
    id: 539,
    question: "Which is NOT a non-functional requirement?",
    options: ["Performance", "Security", "User login feature", "Reliability"],
    answer: "User login feature",
    category: "Software Engineering"
  },
  {
    id: 540,
    question: "What is functional requirement?",
    options: ["What the system should do", "How the system performs", "Hardware needs", "Network speed"],
    answer: "What the system should do",
    category: "Software Engineering"
  },
  {
    id: 541,
    question: "What is the spiral model best for?",
    options: ["Small short projects", "Large, complex, risk-driven projects", "Fixed-cost projects", "Maintenance only"],
    answer: "Large, complex, risk-driven projects",
    category: "Software Engineering"
  },
  {
    id: 542,
    question: "What is a Gantt chart?",
    options: ["A class diagram", "A bar chart showing project schedule and tasks", "A code metric", "A bug tracker"],
    answer: "A bar chart showing project schedule and tasks",
    category: "Software Engineering"
  },
  {
    id: 543,
    question: "What is the COCOMO model used for?",
    options: ["Code formatting", "Estimating software cost and effort", "Database design", "UI design"],
    answer: "Estimating software cost and effort",
    category: "Software Engineering"
  },
  {
    id: 544,
    question: "What is a CASE tool?",
    options: ["A computer case", "Computer-Aided Software Engineering tool", "A project case study", "A test case"],
    answer: "Computer-Aided Software Engineering tool",
    category: "Software Engineering"
  },
  {
    id: 545,
    question: "What is the goal of software maintenance?",
    options: ["To stop the software", "To modify software after delivery to fix issues or improve it", "To delete features", "To compile faster"],
    answer: "To modify software after delivery to fix issues or improve it",
    category: "Software Engineering"
  },
  {
    id: 546,
    question: "What is corrective maintenance?",
    options: ["Adding features", "Fixing defects discovered after release", "Improving performance", "Updating UI"],
    answer: "Fixing defects discovered after release",
    category: "Software Engineering"
  },
  {
    id: 547,
    question: "What is adaptive maintenance?",
    options: ["Modifying software to work in a changed environment", "Bug fixing", "Adding new features", "Improving performance"],
    answer: "Modifying software to work in a changed environment",
    category: "Software Engineering"
  },
  {
    id: 548,
    question: "What is perfective maintenance?",
    options: ["Bug fixing", "Enhancing software based on user feedback", "Removing features", "Recompiling"],
    answer: "Enhancing software based on user feedback",
    category: "Software Engineering"
  },
  {
    id: 549,
    question: "What is a software metric?",
    options: ["A measure of some property of software", "A type of test", "A design pattern", "A code editor"],
    answer: "A measure of some property of software",
    category: "Software Engineering"
  },
  {
    id: 550,
    question: "What does LOC stand for in metrics?",
    options: ["Lines of Code", "Logic Operations Count", "List of Conditions", "Loop Output Counter"],
    answer: "Lines of Code",
    category: "Software Engineering"
  },
  {
    id: 551,
    question: "What is requirement engineering?",
    options: ["Hardware design", "The process of defining, documenting, and maintaining software requirements", "Coding", "Marketing"],
    answer: "The process of defining, documenting, and maintaining software requirements",
    category: "Software Requirement Engineering"
  },
  {
    id: 552,
    question: "Which is the FIRST phase of requirement engineering?",
    options: ["Validation", "Elicitation", "Specification", "Management"],
    answer: "Elicitation",
    category: "Software Requirement Engineering"
  },
  {
    id: 553,
    question: "What is requirement elicitation?",
    options: ["Writing code", "The process of gathering requirements from stakeholders", "Testing software", "Designing UI"],
    answer: "The process of gathering requirements from stakeholders",
    category: "Software Requirement Engineering"
  },
  {
    id: 554,
    question: "Which is NOT an elicitation technique?",
    options: ["Interviews", "Brainstorming", "Random guessing", "Workshops"],
    answer: "Random guessing",
    category: "Software Requirement Engineering"
  },
  {
    id: 555,
    question: "What is an SRS document?",
    options: ["Source code repository", "Software Requirements Specification", "System reliability score", "Sales report"],
    answer: "Software Requirements Specification",
    category: "Software Requirement Engineering"
  },
  {
    id: 556,
    question: "Which IEEE standard governs SRS?",
    options: ["IEEE 830", "IEEE 802", "IEEE 1394", "IEEE 754"],
    answer: "IEEE 830",
    category: "Software Requirement Engineering"
  },
  {
    id: 557,
    question: "What is a functional requirement?",
    options: ["What the system must DO", "How the system performs", "User look-and-feel", "Hardware spec"],
    answer: "What the system must DO",
    category: "Software Requirement Engineering"
  },
  {
    id: 558,
    question: "What is a non-functional requirement?",
    options: ["Features", "Constraints on how the system must behave (e.g., performance, security)", "Use cases", "Test cases"],
    answer: "Constraints on how the system must behave (e.g., performance, security)",
    category: "Software Requirement Engineering"
  },
  {
    id: 559,
    question: "Which is a non-functional requirement?",
    options: ["Login functionality", "Response time under 2 seconds", "Add-to-cart feature", "Generate report"],
    answer: "Response time under 2 seconds",
    category: "Software Requirement Engineering"
  },
  {
    id: 560,
    question: "What is requirement validation?",
    options: ["Writing requirements", "Confirming that requirements meet stakeholder needs and are consistent", "Coding", "Deployment"],
    answer: "Confirming that requirements meet stakeholder needs and are consistent",
    category: "Software Requirement Engineering"
  },
  {
    id: 561,
    question: "What is a use case?",
    options: ["A scenario describing how a user interacts with the system", "A test case", "A design pattern", "A bug report"],
    answer: "A scenario describing how a user interacts with the system",
    category: "Software Requirement Engineering"
  },
  {
    id: 562,
    question: "Who is an actor in a use case?",
    options: ["A movie star", "A person, role, or system that interacts with the software", "A test variable", "The compiler"],
    answer: "A person, role, or system that interacts with the software",
    category: "Software Requirement Engineering"
  },
  {
    id: 563,
    question: "What is a stakeholder?",
    options: ["Someone who owns shares only", "Anyone affected by or interested in the system", "Only the developer", "Only the customer"],
    answer: "Anyone affected by or interested in the system",
    category: "Software Requirement Engineering"
  },
  {
    id: 564,
    question: "Which is a primary stakeholder?",
    options: ["The developers", "The end-users of the system", "The IT vendor", "The lawyers"],
    answer: "The end-users of the system",
    category: "Software Requirement Engineering"
  },
  {
    id: 565,
    question: "What is requirement traceability?",
    options: ["Tracking ownership of requirements", "The ability to follow a requirement through its lifecycle", "Tracing IP addresses", "Auditing money"],
    answer: "The ability to follow a requirement through its lifecycle",
    category: "Software Requirement Engineering"
  },
  {
    id: 566,
    question: "What is requirement scope creep?",
    options: ["Reducing requirements", "Uncontrolled expansion of project scope or requirements", "Stable requirements", "Deleting features"],
    answer: "Uncontrolled expansion of project scope or requirements",
    category: "Software Requirement Engineering"
  },
  {
    id: 567,
    question: "What is requirement prioritization?",
    options: ["Random ordering", "Ranking requirements based on importance and urgency", "Implementing all at once", "Skipping requirements"],
    answer: "Ranking requirements based on importance and urgency",
    category: "Software Requirement Engineering"
  },
  {
    id: 568,
    question: "What does MoSCoW stand for in requirements?",
    options: ["A Russian city", "Must have, Should have, Could have, Won't have", "Method of Scrum Cost Workflow", "A risk register"],
    answer: "Must have, Should have, Could have, Won't have",
    category: "Software Requirement Engineering"
  },
  {
    id: 569,
    question: "What is a requirement specification?",
    options: ["A code listing", "A complete description of the behavior of the system to be developed", "A salary chart", "A user manual"],
    answer: "A complete description of the behavior of the system to be developed",
    category: "Software Requirement Engineering"
  },
  {
    id: 570,
    question: "What is requirement ambiguity?",
    options: ["Clear requirement", "A requirement that can be interpreted in multiple ways", "A duplicate requirement", "A locked requirement"],
    answer: "A requirement that can be interpreted in multiple ways",
    category: "Software Requirement Engineering"
  },
  {
    id: 571,
    question: "What is a context diagram?",
    options: ["A class diagram", "A high-level diagram showing the system and its external entities", "A bug report", "A flowchart only"],
    answer: "A high-level diagram showing the system and its external entities",
    category: "Software Requirement Engineering"
  },
  {
    id: 572,
    question: "What is a data flow diagram (DFD)?",
    options: ["A graph of data structures", "A diagram representing the flow of data through a system", "A type of class diagram", "An ER diagram"],
    answer: "A diagram representing the flow of data through a system",
    category: "Software Requirement Engineering"
  },
  {
    id: 573,
    question: "What is the goal of requirement analysis?",
    options: ["Hiring developers", "Understanding stakeholder needs and refining them into clear requirements", "Estimating cost only", "Writing test cases"],
    answer: "Understanding stakeholder needs and refining them into clear requirements",
    category: "Software Requirement Engineering"
  },
  {
    id: 574,
    question: "Which technique uses simulated systems for requirement gathering?",
    options: ["Surveys", "Prototyping", "Interviews", "Document review"],
    answer: "Prototyping",
    category: "Software Requirement Engineering"
  },
  {
    id: 575,
    question: "What is JAD (Joint Application Development)?",
    options: ["A coding workshop", "A facilitated session bringing stakeholders together to define requirements", "A testing method", "A pair programming style"],
    answer: "A facilitated session bringing stakeholders together to define requirements",
    category: "Software Requirement Engineering"
  },
  {
    id: 576,
    question: "What is a requirement baseline?",
    options: ["The first draft", "A formally approved version of requirements that serves as a basis for further work", "A budget", "A test report"],
    answer: "A formally approved version of requirements that serves as a basis for further work",
    category: "Software Requirement Engineering"
  },
  {
    id: 577,
    question: "Which is a requirement quality attribute?",
    options: ["Verifiable", "Vague", "Conflicting", "Hidden"],
    answer: "Verifiable",
    category: "Software Requirement Engineering"
  },
  {
    id: 578,
    question: "What is a requirements management tool?",
    options: ["A debugger", "A tool to track, organize, and manage requirements (e.g., Jira, DOORS)", "A code editor", "A compiler"],
    answer: "A tool to track, organize, and manage requirements (e.g., Jira, DOORS)",
    category: "Software Requirement Engineering"
  },
  {
    id: 579,
    question: "What is requirement negotiation?",
    options: ["Buying software", "Resolving conflicts between stakeholders about requirements", "Salary discussion", "Vendor selection"],
    answer: "Resolving conflicts between stakeholders about requirements",
    category: "Software Requirement Engineering"
  },
  {
    id: 580,
    question: "What does FURPS stand for?",
    options: ["A type of furry animal", "Functionality, Usability, Reliability, Performance, Supportability", "Fast User Requirement Processing System", "Fixed User Reporting and Processing Strategy"],
    answer: "Functionality, Usability, Reliability, Performance, Supportability",
    category: "Software Requirement Engineering"
  },
  {
    id: 581,
    question: "What is requirement traceability matrix (RTM)?",
    options: ["A spreadsheet linking requirements to design, code, and tests", "A class diagram", "A user manual", "A bug report"],
    answer: "A spreadsheet linking requirements to design, code, and tests",
    category: "Software Requirement Engineering"
  },
  {
    id: 582,
    question: "Which characteristic should a good requirement have?",
    options: ["Ambiguous", "Unmeasurable", "Unambiguous and verifiable", "Optional and vague"],
    answer: "Unambiguous and verifiable",
    category: "Software Requirement Engineering"
  },
  {
    id: 583,
    question: "What is a constraint in requirements?",
    options: ["A bug", "A limitation imposed on the system (e.g., budget, technology)", "A test case", "A use case"],
    answer: "A limitation imposed on the system (e.g., budget, technology)",
    category: "Software Requirement Engineering"
  },
  {
    id: 584,
    question: "What is a domain analysis?",
    options: ["DNS lookup", "Studying the application domain to understand requirements", "Network analysis", "Code review"],
    answer: "Studying the application domain to understand requirements",
    category: "Software Requirement Engineering"
  },
  {
    id: 585,
    question: "What is requirement engineering process?",
    options: ["Coding only", "Elicitation, Analysis, Specification, Validation, Management", "Just gathering requirements", "Designing UI"],
    answer: "Elicitation, Analysis, Specification, Validation, Management",
    category: "Software Requirement Engineering"
  },
  {
    id: 586,
    question: "Which document captures user needs in their language?",
    options: ["Technical spec", "User Requirements Document", "Design document", "Test plan"],
    answer: "User Requirements Document",
    category: "Software Requirement Engineering"
  },
  {
    id: 587,
    question: "What is a system requirement?",
    options: ["What users want", "Detailed specifications of system services and constraints", "Hardware purchase order", "A test case"],
    answer: "Detailed specifications of system services and constraints",
    category: "Software Requirement Engineering"
  },
  {
    id: 588,
    question: "What is requirement reuse?",
    options: ["Recycling waste", "Using requirements from previous projects in new ones", "Deleting old requirements", "Renaming requirements"],
    answer: "Using requirements from previous projects in new ones",
    category: "Software Requirement Engineering"
  },
  {
    id: 589,
    question: "Which is a problem in requirement engineering?",
    options: ["Stakeholder communication issues", "Stable requirements", "Clear specs", "Single user"],
    answer: "Stakeholder communication issues",
    category: "Software Requirement Engineering"
  },
  {
    id: 590,
    question: "What is a feasibility study?",
    options: ["Coding test", "Analysis to determine viability of a project", "User testing", "Bug tracking"],
    answer: "Analysis to determine viability of a project",
    category: "Software Requirement Engineering"
  },
  {
    id: 591,
    question: "Which type of feasibility checks if technology supports the project?",
    options: ["Economic", "Technical", "Operational", "Legal"],
    answer: "Technical",
    category: "Software Requirement Engineering"
  },
  {
    id: 592,
    question: "What is operational feasibility?",
    options: ["Budget check", "Whether the system can be operated successfully by users in their environment", "Hardware check", "Legal compliance"],
    answer: "Whether the system can be operated successfully by users in their environment",
    category: "Software Requirement Engineering"
  },
  {
    id: 593,
    question: "What is a soft requirement?",
    options: ["A non-mandatory requirement", "A loose, low-priority desired feature", "A flexible non-functional preference", "A removed requirement"],
    answer: "A flexible non-functional preference",
    category: "Software Requirement Engineering"
  },
  {
    id: 594,
    question: "What does an entity-relationship (ER) diagram model?",
    options: ["Code logic", "Data entities and their relationships", "Network traffic", "Process flow"],
    answer: "Data entities and their relationships",
    category: "Software Requirement Engineering"
  },
  {
    id: 595,
    question: "What is requirement creep?",
    options: ["Slow systems", "Gradual addition of new requirements during development", "Bug crawl", "Reduced features"],
    answer: "Gradual addition of new requirements during development",
    category: "Software Requirement Engineering"
  },
  {
    id: 596,
    question: "Which technique observes users in their workplace?",
    options: ["Interviews", "Surveys", "Ethnography / observation", "Brainstorming"],
    answer: "Ethnography / observation",
    category: "Software Requirement Engineering"
  },
  {
    id: 597,
    question: "What is a viewpoint in requirement engineering?",
    options: ["A camera angle", "A perspective from which requirements are gathered (e.g., user, manager)", "A test view", "A class view"],
    answer: "A perspective from which requirements are gathered (e.g., user, manager)",
    category: "Software Requirement Engineering"
  },
  {
    id: 598,
    question: "What is requirement evolution?",
    options: ["Requirements becoming animals", "How requirements change over time during a project", "Requirements deletion", "A static state"],
    answer: "How requirements change over time during a project",
    category: "Software Requirement Engineering"
  },
  {
    id: 599,
    question: "What is meant by 'completeness' of requirements?",
    options: ["All necessary requirements are documented", "Code is finished", "Tests are passed", "Hardware is bought"],
    answer: "All necessary requirements are documented",
    category: "Software Requirement Engineering"
  },
  {
    id: 600,
    question: "What is meant by 'consistency' of requirements?",
    options: ["Requirements don't conflict with each other", "All requirements take same time", "Requirements use bullet points", "Requirements are random"],
    answer: "Requirements don't conflict with each other",
    category: "Software Requirement Engineering"
  },
  {
    id: 601,
    question: "What does the CIA triad in information security stand for?",
    options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Cipher, Internet, Authentication", "Code, Identity, Access"],
    answer: "Confidentiality, Integrity, Availability",
    category: "Information Security"
  },
  {
    id: 602,
    question: "Which principle ensures information is not disclosed to unauthorized parties?",
    options: ["Integrity", "Confidentiality", "Availability", "Non-repudiation"],
    answer: "Confidentiality",
    category: "Information Security"
  },
  {
    id: 603,
    question: "Which principle ensures information is not altered without authorization?",
    options: ["Confidentiality", "Integrity", "Availability", "Authentication"],
    answer: "Integrity",
    category: "Information Security"
  },
  {
    id: 604,
    question: "Which principle ensures information is accessible when needed?",
    options: ["Confidentiality", "Integrity", "Availability", "Authorization"],
    answer: "Availability",
    category: "Information Security"
  },
  {
    id: 605,
    question: "What is authentication?",
    options: ["Granting permissions", "Verifying the identity of a user or system", "Encrypting data", "Logging events"],
    answer: "Verifying the identity of a user or system",
    category: "Information Security"
  },
  {
    id: 606,
    question: "What is authorization?",
    options: ["Verifying identity", "Granting permissions to access resources", "Encrypting data", "Hashing"],
    answer: "Granting permissions to access resources",
    category: "Information Security"
  },
  {
    id: 607,
    question: "What is non-repudiation?",
    options: ["Denying access", "Inability to deny having performed an action", "Backup verification", "Network encryption"],
    answer: "Inability to deny having performed an action",
    category: "Information Security"
  },
  {
    id: 608,
    question: "Which type of attack involves overwhelming a system with traffic?",
    options: ["Phishing", "DoS (Denial of Service)", "SQL injection", "Spoofing"],
    answer: "DoS (Denial of Service)",
    category: "Information Security"
  },
  {
    id: 609,
    question: "What is a DDoS attack?",
    options: ["Distributed Denial of Service using multiple sources", "A single-source flood attack", "A phishing scam", "Data backup failure"],
    answer: "Distributed Denial of Service using multiple sources",
    category: "Information Security"
  },
  {
    id: 610,
    question: "What is symmetric encryption?",
    options: ["Different keys for encryption and decryption", "Same key used for encryption and decryption", "No key needed", "Public-key cryptography"],
    answer: "Same key used for encryption and decryption",
    category: "Information Security"
  },
  {
    id: 611,
    question: "What is asymmetric encryption?",
    options: ["Same key for both operations", "Uses a public key and a private key", "No keys", "Hashing"],
    answer: "Uses a public key and a private key",
    category: "Information Security"
  },
  {
    id: 612,
    question: "Which is a symmetric encryption algorithm?",
    options: ["RSA", "AES", "ECC", "DSA"],
    answer: "AES",
    category: "Information Security"
  },
  {
    id: 613,
    question: "Which is an asymmetric encryption algorithm?",
    options: ["AES", "DES", "RSA", "Blowfish"],
    answer: "RSA",
    category: "Information Security"
  },
  {
    id: 614,
    question: "What is a hash function used for?",
    options: ["Encryption", "Producing a fixed-size output (digest) from input data", "Compression", "Routing"],
    answer: "Producing a fixed-size output (digest) from input data",
    category: "Information Security"
  },
  {
    id: 615,
    question: "Which is a cryptographic hash algorithm?",
    options: ["AES", "SHA-256", "RSA", "TLS"],
    answer: "SHA-256",
    category: "Information Security"
  },
  {
    id: 616,
    question: "What is salting in password storage?",
    options: ["Adding random data to a password before hashing", "Encrypting passwords", "Compressing passwords", "Encoding in Base64"],
    answer: "Adding random data to a password before hashing",
    category: "Information Security"
  },
  {
    id: 617,
    question: "What is a digital signature?",
    options: ["A typed name", "A cryptographic value that verifies authenticity and integrity of a message", "An image", "A random number"],
    answer: "A cryptographic value that verifies authenticity and integrity of a message",
    category: "Information Security"
  },
  {
    id: 618,
    question: "What is a digital certificate?",
    options: ["A printed document", "An electronic document binding a public key to an identity, issued by a CA", "An email", "A password"],
    answer: "An electronic document binding a public key to an identity, issued by a CA",
    category: "Information Security"
  },
  {
    id: 619,
    question: "What does PKI stand for?",
    options: ["Public Key Infrastructure", "Private Key Identity", "Protected Key Index", "Public Key Indexing"],
    answer: "Public Key Infrastructure",
    category: "Information Security"
  },
  {
    id: 620,
    question: "What is SSL/TLS used for?",
    options: ["Securing communication over a network", "Compression", "Routing", "DNS lookups"],
    answer: "Securing communication over a network",
    category: "Information Security"
  },
  {
    id: 621,
    question: "What is a firewall?",
    options: ["Antivirus software", "A network security system that monitors and controls traffic", "A backup tool", "A password manager"],
    answer: "A network security system that monitors and controls traffic",
    category: "Information Security"
  },
  {
    id: 622,
    question: "What is an IDS?",
    options: ["Identity Document System", "Intrusion Detection System", "Internet Data Source", "Internal Database Server"],
    answer: "Intrusion Detection System",
    category: "Information Security"
  },
  {
    id: 623,
    question: "What is an IPS?",
    options: ["Intrusion Prevention System", "Internet Protocol Service", "Internal Protection Server", "Identity Privacy System"],
    answer: "Intrusion Prevention System",
    category: "Information Security"
  },
  {
    id: 624,
    question: "What is a VPN?",
    options: ["Virtual Private Network — encrypts traffic over a public network", "Very Private Net", "Vulnerability Patch Notice", "Verified Public Node"],
    answer: "Virtual Private Network — encrypts traffic over a public network",
    category: "Information Security"
  },
  {
    id: 625,
    question: "What is phishing?",
    options: ["A type of malware", "Tricking users into revealing sensitive information through fake messages", "A DoS attack", "Network sniffing"],
    answer: "Tricking users into revealing sensitive information through fake messages",
    category: "Information Security"
  },
  {
    id: 626,
    question: "What is social engineering?",
    options: ["Building social media", "Manipulating people into divulging confidential information", "Coding social apps", "Web design"],
    answer: "Manipulating people into divulging confidential information",
    category: "Information Security"
  },
  {
    id: 627,
    question: "What is a man-in-the-middle (MITM) attack?",
    options: ["Two-factor authentication", "An attacker secretly intercepts communication between two parties", "A type of phishing", "A password reset"],
    answer: "An attacker secretly intercepts communication between two parties",
    category: "Information Security"
  },
  {
    id: 628,
    question: "What is malware?",
    options: ["Good software", "Malicious software designed to harm or exploit systems", "A security tool", "An OS"],
    answer: "Malicious software designed to harm or exploit systems",
    category: "Information Security"
  },
  {
    id: 629,
    question: "Which is a type of malware?",
    options: ["Antivirus", "Ransomware", "Firewall", "VPN"],
    answer: "Ransomware",
    category: "Information Security"
  },
  {
    id: 630,
    question: "What does ransomware do?",
    options: ["Speeds up the computer", "Encrypts files and demands payment for decryption", "Backs up data", "Installs antivirus"],
    answer: "Encrypts files and demands payment for decryption",
    category: "Information Security"
  },
  {
    id: 631,
    question: "What is a Trojan horse?",
    options: ["Helpful software", "Malware disguised as legitimate software", "An ancient story", "A network protocol"],
    answer: "Malware disguised as legitimate software",
    category: "Information Security"
  },
  {
    id: 632,
    question: "What is a worm?",
    options: ["A self-replicating malware that spreads across networks without user action", "A virus needing a host", "An anti-malware", "A backup tool"],
    answer: "A self-replicating malware that spreads across networks without user action",
    category: "Information Security"
  },
  {
    id: 633,
    question: "What is two-factor authentication (2FA)?",
    options: ["Two passwords", "Authentication using two different factors (something you know + something you have)", "Two firewalls", "Double encryption"],
    answer: "Authentication using two different factors (something you know + something you have)",
    category: "Information Security"
  },
  {
    id: 634,
    question: "Which is a strong password practice?",
    options: ["Using your name", "Long passphrase with mixed case, digits, symbols", "Reusing passwords", "All lowercase letters"],
    answer: "Long passphrase with mixed case, digits, symbols",
    category: "Information Security"
  },
  {
    id: 635,
    question: "What is access control?",
    options: ["Building a wall", "Mechanisms that restrict access to resources to authorized users", "A type of firewall only", "A password"],
    answer: "Mechanisms that restrict access to resources to authorized users",
    category: "Information Security"
  },
  {
    id: 636,
    question: "What is RBAC?",
    options: ["Random Backup And Control", "Role-Based Access Control", "Remote Bypass Authentication Code", "Restricted Boundary Access Channel"],
    answer: "Role-Based Access Control",
    category: "Information Security"
  },
  {
    id: 637,
    question: "What is the principle of least privilege?",
    options: ["Giving users maximum permissions", "Granting only the permissions necessary to perform a task", "Disabling all permissions", "Using one role for everyone"],
    answer: "Granting only the permissions necessary to perform a task",
    category: "Information Security"
  },
  {
    id: 638,
    question: "What is a security audit?",
    options: ["Code review", "Systematic evaluation of an organization's security posture", "Tax review", "Hardware purchase"],
    answer: "Systematic evaluation of an organization's security posture",
    category: "Information Security"
  },
  {
    id: 639,
    question: "What is a vulnerability?",
    options: ["A weakness that can be exploited", "A security feature", "An encryption algorithm", "A backup"],
    answer: "A weakness that can be exploited",
    category: "Information Security"
  },
  {
    id: 640,
    question: "What is a threat?",
    options: ["A potential cause of an unwanted incident", "A patch", "A user error only", "A security control"],
    answer: "A potential cause of an unwanted incident",
    category: "Information Security"
  },
  {
    id: 641,
    question: "What is risk in security?",
    options: ["Same as a vulnerability", "The potential for loss when a threat exploits a vulnerability", "A control", "A hash function"],
    answer: "The potential for loss when a threat exploits a vulnerability",
    category: "Information Security"
  },
  {
    id: 642,
    question: "What is patch management?",
    options: ["Sewing", "The process of applying updates to software to fix vulnerabilities", "Backup verification", "Network design"],
    answer: "The process of applying updates to software to fix vulnerabilities",
    category: "Information Security"
  },
  {
    id: 643,
    question: "What is data at rest?",
    options: ["Data being transmitted", "Data stored on a device or storage system", "Data being processed", "Deleted data"],
    answer: "Data stored on a device or storage system",
    category: "Information Security"
  },
  {
    id: 644,
    question: "What is data in transit?",
    options: ["Data stored on disk", "Data being moved across a network", "Data in memory", "Backed-up data"],
    answer: "Data being moved across a network",
    category: "Information Security"
  },
  {
    id: 645,
    question: "What does DLP stand for?",
    options: ["Data Loss Prevention", "Distributed Logic Protocol", "Dynamic Link Protector", "Disk Level Permission"],
    answer: "Data Loss Prevention",
    category: "Information Security"
  },
  {
    id: 646,
    question: "What is a security policy?",
    options: ["A code file", "A formal set of rules that govern how an organization manages security", "A firewall rule only", "A type of encryption"],
    answer: "A formal set of rules that govern how an organization manages security",
    category: "Information Security"
  },
  {
    id: 647,
    question: "What is GDPR?",
    options: ["A virus", "European data protection and privacy regulation", "A programming language", "An encryption standard"],
    answer: "European data protection and privacy regulation",
    category: "Information Security"
  },
  {
    id: 648,
    question: "What is a zero-day vulnerability?",
    options: ["An old patched flaw", "A previously unknown vulnerability with no available patch", "A scheduled vulnerability", "A backup error"],
    answer: "A previously unknown vulnerability with no available patch",
    category: "Information Security"
  },
  {
    id: 649,
    question: "What is steganography?",
    options: ["Encryption", "Hiding information within other non-secret data (like images)", "Hashing", "Compressing data"],
    answer: "Hiding information within other non-secret data (like images)",
    category: "Information Security"
  },
  {
    id: 650,
    question: "What is incident response?",
    options: ["Ignoring incidents", "An organized approach to addressing and managing security breaches", "A type of attack", "A backup process"],
    answer: "An organized approach to addressing and managing security breaches",
    category: "Information Security"
  },
  {
    id: 651,
    question: "What is IT infrastructure?",
    options: ["Only computers", "The combined hardware, software, networks, and facilities used to deliver IT services", "Only servers", "Only software"],
    answer: "The combined hardware, software, networks, and facilities used to deliver IT services",
    category: "IT Infrastructure"
  },
  {
    id: 652,
    question: "Which is a component of IT infrastructure?",
    options: ["Servers", "Office furniture", "Marketing plans", "Payroll"],
    answer: "Servers",
    category: "IT Infrastructure"
  },
  {
    id: 653,
    question: "What is a server?",
    options: ["A waiter", "A computer that provides services to other computers (clients)", "A printer", "A switch"],
    answer: "A computer that provides services to other computers (clients)",
    category: "IT Infrastructure"
  },
  {
    id: 654,
    question: "What is a data center?",
    options: ["A retail store", "A facility that houses computer systems and associated infrastructure", "A library", "A classroom"],
    answer: "A facility that houses computer systems and associated infrastructure",
    category: "IT Infrastructure"
  },
  {
    id: 655,
    question: "What is virtualization?",
    options: ["VR gaming", "Creating a virtual version of physical resources like servers or storage", "Cloud only", "A backup method"],
    answer: "Creating a virtual version of physical resources like servers or storage",
    category: "IT Infrastructure"
  },
  {
    id: 656,
    question: "What is a hypervisor?",
    options: ["A monitor", "Software that creates and manages virtual machines", "A firewall", "A router"],
    answer: "Software that creates and manages virtual machines",
    category: "IT Infrastructure"
  },
  {
    id: 657,
    question: "Which is a Type 1 hypervisor?",
    options: ["VMware ESXi", "VirtualBox", "VMware Workstation", "Parallels Desktop"],
    answer: "VMware ESXi",
    category: "IT Infrastructure"
  },
  {
    id: 658,
    question: "What is cloud computing?",
    options: ["Weather data", "Delivery of computing services over the internet", "Local storage", "Hardware design"],
    answer: "Delivery of computing services over the internet",
    category: "IT Infrastructure"
  },
  {
    id: 659,
    question: "Which is NOT a cloud service model?",
    options: ["IaaS", "PaaS", "SaaS", "DaaS-Coding"],
    answer: "DaaS-Coding",
    category: "IT Infrastructure"
  },
  {
    id: 660,
    question: "What does IaaS stand for?",
    options: ["Internet as a Software", "Infrastructure as a Service", "Internal Access Server", "Instance and Storage"],
    answer: "Infrastructure as a Service",
    category: "IT Infrastructure"
  },
  {
    id: 661,
    question: "What does SaaS stand for?",
    options: ["Storage as a Service", "Software as a Service", "Server and Storage", "System and Software"],
    answer: "Software as a Service",
    category: "IT Infrastructure"
  },
  {
    id: 662,
    question: "What does PaaS stand for?",
    options: ["Platform as a Service", "Public Application Server", "Private Access Storage", "Process and System"],
    answer: "Platform as a Service",
    category: "IT Infrastructure"
  },
  {
    id: 663,
    question: "Which is a public cloud provider?",
    options: ["AWS", "MS Office", "Adobe Reader", "Photoshop"],
    answer: "AWS",
    category: "IT Infrastructure"
  },
  {
    id: 664,
    question: "What is a private cloud?",
    options: ["Cloud used by anyone", "Cloud infrastructure dedicated to a single organization", "Free cloud", "Personal email"],
    answer: "Cloud infrastructure dedicated to a single organization",
    category: "IT Infrastructure"
  },
  {
    id: 665,
    question: "What is a hybrid cloud?",
    options: ["Only public", "Combination of public and private clouds", "Only private", "Free trial cloud"],
    answer: "Combination of public and private clouds",
    category: "IT Infrastructure"
  },
  {
    id: 666,
    question: "What is RAID?",
    options: ["A type of attack", "Redundant Array of Independent Disks for storage redundancy/performance", "A router", "A monitoring tool"],
    answer: "Redundant Array of Independent Disks for storage redundancy/performance",
    category: "IT Infrastructure"
  },
  {
    id: 667,
    question: "Which RAID level provides mirroring?",
    options: ["RAID 0", "RAID 1", "RAID 5", "RAID 6"],
    answer: "RAID 1",
    category: "IT Infrastructure"
  },
  {
    id: 668,
    question: "Which RAID level provides striping with no redundancy?",
    options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
    answer: "RAID 0",
    category: "IT Infrastructure"
  },
  {
    id: 669,
    question: "What is SAN?",
    options: ["A backup tool", "Storage Area Network — a high-speed dedicated network for storage", "A virus", "A protocol"],
    answer: "Storage Area Network — a high-speed dedicated network for storage",
    category: "IT Infrastructure"
  },
  {
    id: 670,
    question: "What is NAS?",
    options: ["Network Attached Storage — file-level storage shared over a network", "An OS", "A processor", "A protocol"],
    answer: "Network Attached Storage — file-level storage shared over a network",
    category: "IT Infrastructure"
  },
  {
    id: 671,
    question: "What is a UPS in IT infrastructure?",
    options: ["A delivery service", "Uninterruptible Power Supply — provides backup power", "A printer", "A protocol"],
    answer: "Uninterruptible Power Supply — provides backup power",
    category: "IT Infrastructure"
  },
  {
    id: 672,
    question: "What is high availability?",
    options: ["Always offline", "Systems designed to be operational with minimal downtime", "A backup type", "An OS feature only"],
    answer: "Systems designed to be operational with minimal downtime",
    category: "IT Infrastructure"
  },
  {
    id: 673,
    question: "What is fault tolerance?",
    options: ["Patience", "Ability of a system to continue operating despite component failures", "A type of bug", "A backup"],
    answer: "Ability of a system to continue operating despite component failures",
    category: "IT Infrastructure"
  },
  {
    id: 674,
    question: "What is load balancing?",
    options: ["Equal billing", "Distributing workloads across multiple resources for efficiency", "Disk scheduling", "An OS process"],
    answer: "Distributing workloads across multiple resources for efficiency",
    category: "IT Infrastructure"
  },
  {
    id: 675,
    question: "What is scalability?",
    options: ["Drawing scale", "Ability to handle increased load by adding resources", "Compression rate", "A type of bug"],
    answer: "Ability to handle increased load by adding resources",
    category: "IT Infrastructure"
  },
  {
    id: 676,
    question: "What is vertical scaling?",
    options: ["Adding more machines", "Adding more resources (CPU/RAM) to an existing machine", "Replicating data", "Compressing files"],
    answer: "Adding more resources (CPU/RAM) to an existing machine",
    category: "IT Infrastructure"
  },
  {
    id: 677,
    question: "What is horizontal scaling?",
    options: ["Upgrading a single server", "Adding more machines to handle increased load", "Backing up disks", "Resizing a window"],
    answer: "Adding more machines to handle increased load",
    category: "IT Infrastructure"
  },
  {
    id: 678,
    question: "What is an SLA?",
    options: ["Service Level Agreement — a contract defining service expectations", "A subnet", "A protocol", "A processor"],
    answer: "Service Level Agreement — a contract defining service expectations",
    category: "IT Infrastructure"
  },
  {
    id: 679,
    question: "What is uptime?",
    options: ["Time of day", "The amount of time a system is operational", "Boot time", "User session time"],
    answer: "The amount of time a system is operational",
    category: "IT Infrastructure"
  },
  {
    id: 680,
    question: "What does '99.99% uptime' mean?",
    options: ["About 1 hour downtime per year", "About 52 minutes downtime per year", "Always offline", "100% uptime"],
    answer: "About 52 minutes downtime per year",
    category: "IT Infrastructure"
  },
  {
    id: 681,
    question: "What is ITIL?",
    options: ["A programming language", "A framework for IT service management", "A database", "A protocol"],
    answer: "A framework for IT service management",
    category: "IT Infrastructure"
  },
  {
    id: 682,
    question: "What is a help desk?",
    options: ["A service that provides support to users", "A printer", "A database", "A hardware vendor"],
    answer: "A service that provides support to users",
    category: "IT Infrastructure"
  },
  {
    id: 683,
    question: "What is provisioning?",
    options: ["Buying snacks", "Setting up IT infrastructure to make it ready for use", "Backing up", "Encrypting"],
    answer: "Setting up IT infrastructure to make it ready for use",
    category: "IT Infrastructure"
  },
  {
    id: 684,
    question: "What is configuration management?",
    options: ["Tracking and controlling system configurations", "Hiring IT staff", "A backup type", "A type of attack"],
    answer: "Tracking and controlling system configurations",
    category: "IT Infrastructure"
  },
  {
    id: 685,
    question: "Which is a configuration management tool?",
    options: ["Ansible", "Photoshop", "Excel", "Outlook"],
    answer: "Ansible",
    category: "IT Infrastructure"
  },
  {
    id: 686,
    question: "What is monitoring in IT?",
    options: ["Watching TV", "Continuously observing systems for performance and health", "Backing up", "Encryption"],
    answer: "Continuously observing systems for performance and health",
    category: "IT Infrastructure"
  },
  {
    id: 687,
    question: "Which is a popular monitoring tool?",
    options: ["Nagios", "Photoshop", "Word", "Notepad"],
    answer: "Nagios",
    category: "IT Infrastructure"
  },
  {
    id: 688,
    question: "What is disaster recovery (DR)?",
    options: ["A natural disaster", "Plans and processes to recover IT after disruptive events", "A backup software", "A type of OS"],
    answer: "Plans and processes to recover IT after disruptive events",
    category: "IT Infrastructure"
  },
  {
    id: 689,
    question: "What does RTO stand for?",
    options: ["Recovery Time Objective", "Response Test Order", "Real-Time Output", "Remote Tracking Operation"],
    answer: "Recovery Time Objective",
    category: "IT Infrastructure"
  },
  {
    id: 690,
    question: "What does RPO stand for?",
    options: ["Recovery Point Objective", "Remote Process Output", "Random Path Order", "Resource Priority Order"],
    answer: "Recovery Point Objective",
    category: "IT Infrastructure"
  },
  {
    id: 691,
    question: "What is a backup?",
    options: ["A copy of data stored separately to prevent loss", "Original data", "An OS", "A protocol"],
    answer: "A copy of data stored separately to prevent loss",
    category: "IT Infrastructure"
  },
  {
    id: 692,
    question: "Which is a type of backup?",
    options: ["Full", "Random", "Bouncy", "Casual"],
    answer: "Full",
    category: "IT Infrastructure"
  },
  {
    id: 693,
    question: "What is an incremental backup?",
    options: ["Full copy each time", "Copies only data changed since the last backup", "Cloud-only", "Manual transcription"],
    answer: "Copies only data changed since the last backup",
    category: "IT Infrastructure"
  },
  {
    id: 694,
    question: "What is a differential backup?",
    options: ["Copies changes since the last full backup", "Same as incremental", "Random", "A snapshot only"],
    answer: "Copies changes since the last full backup",
    category: "IT Infrastructure"
  },
  {
    id: 695,
    question: "What is a hot site?",
    options: ["A warm room", "A fully operational backup site for disaster recovery", "A power plant", "A hot data feed"],
    answer: "A fully operational backup site for disaster recovery",
    category: "IT Infrastructure"
  },
  {
    id: 696,
    question: "What is a cold site?",
    options: ["A site with all systems running", "A backup facility with infrastructure but no real-time data/systems", "A frozen backup", "A printer room"],
    answer: "A backup facility with infrastructure but no real-time data/systems",
    category: "IT Infrastructure"
  },
  {
    id: 697,
    question: "What is a blade server?",
    options: ["A sharp tool", "A compact server housed in a blade enclosure", "A standalone PC", "A network switch"],
    answer: "A compact server housed in a blade enclosure",
    category: "IT Infrastructure"
  },
  {
    id: 698,
    question: "What is containerization?",
    options: ["Boxing servers", "Packaging applications with their dependencies for portable deployment", "A type of cooling", "An encryption method"],
    answer: "Packaging applications with their dependencies for portable deployment",
    category: "IT Infrastructure"
  },
  {
    id: 699,
    question: "Which tool is famous for containerization?",
    options: ["Docker", "Photoshop", "Excel", "Outlook"],
    answer: "Docker",
    category: "IT Infrastructure"
  },
  {
    id: 700,
    question: "What is Kubernetes?",
    options: ["A virus", "An open-source container orchestration platform", "A database", "An OS"],
    answer: "An open-source container orchestration platform",
    category: "IT Infrastructure"
  },
  {
    id: 701,
    question: "What is a system administrator?",
    options: ["A salesperson", "A person responsible for managing and maintaining computer systems", "A web designer", "A user"],
    answer: "A person responsible for managing and maintaining computer systems",
    category: "System and Network Administration"
  },
  {
    id: 702,
    question: "Which command in Linux changes the owner of a file?",
    options: ["chmod", "chown", "chgrp", "chperm"],
    answer: "chown",
    category: "System and Network Administration"
  },
  {
    id: 703,
    question: "Which command in Linux changes file permissions?",
    options: ["chmod", "chown", "passwd", "useradd"],
    answer: "chmod",
    category: "System and Network Administration"
  },
  {
    id: 704,
    question: "What does 'chmod 755' mean?",
    options: ["Owner: rwx, Group: rx, Others: rx", "Everyone full access", "Owner only", "No access"],
    answer: "Owner: rwx, Group: rx, Others: rx",
    category: "System and Network Administration"
  },
  {
    id: 705,
    question: "Which Linux command adds a new user?",
    options: ["adduser / useradd", "newuser", "createuser", "makeuser"],
    answer: "adduser / useradd",
    category: "System and Network Administration"
  },
  {
    id: 706,
    question: "Which file stores user account information in Linux?",
    options: ["/etc/passwd", "/etc/users", "/var/users", "/home/users"],
    answer: "/etc/passwd",
    category: "System and Network Administration"
  },
  {
    id: 707,
    question: "Which file stores hashed passwords in Linux?",
    options: ["/etc/passwd", "/etc/shadow", "/etc/users", "/etc/auth"],
    answer: "/etc/shadow",
    category: "System and Network Administration"
  },
  {
    id: 708,
    question: "What is the root user?",
    options: ["A regular user", "The superuser with full administrative privileges", "A guest", "A visitor"],
    answer: "The superuser with full administrative privileges",
    category: "System and Network Administration"
  },
  {
    id: 709,
    question: "Which command lets a user run commands as another user (often root)?",
    options: ["sudo", "go", "exec", "run"],
    answer: "sudo",
    category: "System and Network Administration"
  },
  {
    id: 710,
    question: "Which command shows currently logged-in users?",
    options: ["who", "users", "id", "whoami"],
    answer: "who",
    category: "System and Network Administration"
  },
  {
    id: 711,
    question: "Which Linux command shows disk usage of files/directories?",
    options: ["df", "du", "ls", "free"],
    answer: "du",
    category: "System and Network Administration"
  },
  {
    id: 712,
    question: "Which command displays free disk space on filesystems?",
    options: ["df", "du", "free", "fdisk"],
    answer: "df",
    category: "System and Network Administration"
  },
  {
    id: 713,
    question: "Which command displays system memory usage?",
    options: ["mem", "free", "df", "top"],
    answer: "free",
    category: "System and Network Administration"
  },
  {
    id: 714,
    question: "Which command displays processes interactively?",
    options: ["ps", "top", "ls", "df"],
    answer: "top",
    category: "System and Network Administration"
  },
  {
    id: 715,
    question: "Which command terminates a process by PID?",
    options: ["kill", "stop", "end", "term"],
    answer: "kill",
    category: "System and Network Administration"
  },
  {
    id: 716,
    question: "Which signal forcefully terminates a process?",
    options: ["SIGTERM", "SIGKILL", "SIGINT", "SIGHUP"],
    answer: "SIGKILL",
    category: "System and Network Administration"
  },
  {
    id: 717,
    question: "What is cron used for?",
    options: ["Compiling code", "Scheduling recurring tasks on Unix-like systems", "User management", "File compression"],
    answer: "Scheduling recurring tasks on Unix-like systems",
    category: "System and Network Administration"
  },
  {
    id: 718,
    question: "What is the configuration file for cron jobs called?",
    options: ["crontab", "cronjob", "cronfile", "schedule.cron"],
    answer: "crontab",
    category: "System and Network Administration"
  },
  {
    id: 719,
    question: "Which protocol is used for secure remote login?",
    options: ["Telnet", "SSH", "FTP", "HTTP"],
    answer: "SSH",
    category: "System and Network Administration"
  },
  {
    id: 720,
    question: "Default port for SSH?",
    options: ["21", "22", "80", "443"],
    answer: "22",
    category: "System and Network Administration"
  },
  {
    id: 721,
    question: "Default port for HTTP?",
    options: ["21", "22", "80", "443"],
    answer: "80",
    category: "System and Network Administration"
  },
  {
    id: 722,
    question: "Default port for HTTPS?",
    options: ["21", "22", "80", "443"],
    answer: "443",
    category: "System and Network Administration"
  },
  {
    id: 723,
    question: "Default port for FTP?",
    options: ["21", "22", "53", "80"],
    answer: "21",
    category: "System and Network Administration"
  },
  {
    id: 724,
    question: "Default port for DNS?",
    options: ["21", "53", "80", "143"],
    answer: "53",
    category: "System and Network Administration"
  },
  {
    id: 725,
    question: "What does DHCP do?",
    options: ["Encrypts files", "Automatically assigns IP addresses to devices on a network", "Hosts websites", "Filters traffic"],
    answer: "Automatically assigns IP addresses to devices on a network",
    category: "System and Network Administration"
  },
  {
    id: 726,
    question: "What is DNS?",
    options: ["Domain Name System — translates domain names to IP addresses", "A server type", "A backup tool", "A protocol for email only"],
    answer: "Domain Name System — translates domain names to IP addresses",
    category: "System and Network Administration"
  },
  {
    id: 727,
    question: "Which command queries DNS records on Linux?",
    options: ["dig / nslookup", "ping", "traceroute", "ssh"],
    answer: "dig / nslookup",
    category: "System and Network Administration"
  },
  {
    id: 728,
    question: "What does the ping command do?",
    options: ["Compiles code", "Tests reachability between hosts via ICMP echo", "Encrypts traffic", "Backs up data"],
    answer: "Tests reachability between hosts via ICMP echo",
    category: "System and Network Administration"
  },
  {
    id: 729,
    question: "Which command shows the route packets take to a destination?",
    options: ["ping", "traceroute / tracert", "ifconfig", "ipconfig"],
    answer: "traceroute / tracert",
    category: "System and Network Administration"
  },
  {
    id: 730,
    question: "Which Windows command displays IP configuration?",
    options: ["ifconfig", "ipconfig", "netshow", "iptable"],
    answer: "ipconfig",
    category: "System and Network Administration"
  },
  {
    id: 731,
    question: "Which Linux command displays network interface info?",
    options: ["ipconfig", "ifconfig / ip addr", "iplook", "showip"],
    answer: "ifconfig / ip addr",
    category: "System and Network Administration"
  },
  {
    id: 732,
    question: "What is Active Directory (AD)?",
    options: ["A Linux directory", "Microsoft's directory service for managing users and resources", "A backup utility", "A file system"],
    answer: "Microsoft's directory service for managing users and resources",
    category: "System and Network Administration"
  },
  {
    id: 733,
    question: "What is a domain controller?",
    options: ["A router", "A server that authenticates users in a Windows domain", "A switch", "A modem"],
    answer: "A server that authenticates users in a Windows domain",
    category: "System and Network Administration"
  },
  {
    id: 734,
    question: "What is Group Policy used for?",
    options: ["Posting on social media", "Centrally managing user and computer settings in AD", "Photo editing", "Compiling code"],
    answer: "Centrally managing user and computer settings in AD",
    category: "System and Network Administration"
  },
  {
    id: 735,
    question: "Which Linux package manager is used in Debian/Ubuntu?",
    options: ["yum", "apt", "dnf", "pacman"],
    answer: "apt",
    category: "System and Network Administration"
  },
  {
    id: 736,
    question: "Which Linux package manager is used in RHEL/CentOS?",
    options: ["apt", "yum / dnf", "pacman", "snap"],
    answer: "yum / dnf",
    category: "System and Network Administration"
  },
  {
    id: 737,
    question: "What is iptables used for?",
    options: ["Database tables", "Configuring Linux kernel firewall rules", "File system", "DNS"],
    answer: "Configuring Linux kernel firewall rules",
    category: "System and Network Administration"
  },
  {
    id: 738,
    question: "Which protocol is used for sending email?",
    options: ["IMAP", "SMTP", "POP3", "SNMP"],
    answer: "SMTP",
    category: "System and Network Administration"
  },
  {
    id: 739,
    question: "Which protocol retrieves email and keeps it on the server?",
    options: ["POP3", "IMAP", "SMTP", "FTP"],
    answer: "IMAP",
    category: "System and Network Administration"
  },
  {
    id: 740,
    question: "Which protocol is used to monitor network devices?",
    options: ["SMTP", "SNMP", "ICMP", "DNS"],
    answer: "SNMP",
    category: "System and Network Administration"
  },
  {
    id: 741,
    question: "What is a logical volume in Linux?",
    options: ["A flexible storage abstraction allowing resizable partitions (LVM)", "A physical partition", "A CD-ROM", "A swap file"],
    answer: "A flexible storage abstraction allowing resizable partitions (LVM)",
    category: "System and Network Administration"
  },
  {
    id: 742,
    question: "Which command in Linux mounts a filesystem?",
    options: ["mount", "attach", "fs", "open"],
    answer: "mount",
    category: "System and Network Administration"
  },
  {
    id: 743,
    question: "What is /etc/fstab?",
    options: ["A user list", "A file describing filesystems to mount at boot", "A log file", "A binary"],
    answer: "A file describing filesystems to mount at boot",
    category: "System and Network Administration"
  },
  {
    id: 744,
    question: "Which command shows running services in systemd?",
    options: ["service", "systemctl", "init", "rc"],
    answer: "systemctl",
    category: "System and Network Administration"
  },
  {
    id: 745,
    question: "Which command shows logs in systemd?",
    options: ["dmesg", "journalctl", "logshow", "syslog"],
    answer: "journalctl",
    category: "System and Network Administration"
  },
  {
    id: 746,
    question: "What does NAT stand for?",
    options: ["Network Address Translation", "Net Access Tool", "Network Authentication Type", "Node Address Tag"],
    answer: "Network Address Translation",
    category: "System and Network Administration"
  },
  {
    id: 747,
    question: "What is a subnet mask used for?",
    options: ["Encrypting traffic", "Determining which portion of an IP is the network and host", "Compressing files", "Routing protocols"],
    answer: "Determining which portion of an IP is the network and host",
    category: "System and Network Administration"
  },
  {
    id: 748,
    question: "What is the default subnet mask for a /24 network?",
    options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
    answer: "255.255.255.0",
    category: "System and Network Administration"
  },
  {
    id: 749,
    question: "What is a VLAN?",
    options: ["A virus", "Virtual LAN — a logical subdivision of a physical network", "A new IP version", "A cloud service"],
    answer: "Virtual LAN — a logical subdivision of a physical network",
    category: "System and Network Administration"
  },
  {
    id: 750,
    question: "What is system patching?",
    options: ["Sewing", "Applying updates and fixes to system software", "Deleting files", "Reinstalling OS"],
    answer: "Applying updates and fixes to system software",
    category: "System and Network Administration"
  },
  {
    id: 751,
    question: "What is a database administrator (DBA)?",
    options: ["A user", "A professional responsible for the design, security, and performance of databases", "A web designer", "A network admin"],
    answer: "A professional responsible for the design, security, and performance of databases",
    category: "Database Administration & Management"
  },
  {
    id: 752,
    question: "What is database tuning?",
    options: ["Playing music", "Optimizing database performance", "Backing up data", "Encrypting data"],
    answer: "Optimizing database performance",
    category: "Database Administration & Management"
  },
  {
    id: 753,
    question: "Which is a popular RDBMS?",
    options: ["Photoshop", "Oracle", "Outlook", "Word"],
    answer: "Oracle",
    category: "Database Administration & Management"
  },
  {
    id: 754,
    question: "Which command in SQL grants permissions to users?",
    options: ["ALLOW", "GRANT", "PERMIT", "GIVE"],
    answer: "GRANT",
    category: "Database Administration & Management"
  },
  {
    id: 755,
    question: "Which command revokes permissions in SQL?",
    options: ["DENY", "REVOKE", "REMOVE", "DROP"],
    answer: "REVOKE",
    category: "Database Administration & Management"
  },
  {
    id: 756,
    question: "What is a transaction?",
    options: ["A bank deposit only", "A logical unit of work that must be completed entirely or not at all", "A backup", "A query"],
    answer: "A logical unit of work that must be completed entirely or not at all",
    category: "Database Administration & Management"
  },
  {
    id: 757,
    question: "What does ACID stand for?",
    options: ["Atomicity, Consistency, Isolation, Durability", "Application, Code, Index, Data", "Access Control Identity Database", "Async Concurrent Index Database"],
    answer: "Atomicity, Consistency, Isolation, Durability",
    category: "Database Administration & Management"
  },
  {
    id: 758,
    question: "What does atomicity mean in transactions?",
    options: ["Tiny size", "All operations succeed or none do", "Speed", "Encryption"],
    answer: "All operations succeed or none do",
    category: "Database Administration & Management"
  },
  {
    id: 759,
    question: "What is durability?",
    options: ["Long lasting hardware", "Once committed, transaction changes persist even after failures", "Cloud storage", "Encryption strength"],
    answer: "Once committed, transaction changes persist even after failures",
    category: "Database Administration & Management"
  },
  {
    id: 760,
    question: "What is a deadlock in databases?",
    options: ["A locked door", "Two or more transactions waiting indefinitely for each other's locks", "A backup", "A schema error"],
    answer: "Two or more transactions waiting indefinitely for each other's locks",
    category: "Database Administration & Management"
  },
  {
    id: 761,
    question: "Which is a method to handle deadlocks?",
    options: ["Ignore", "Detect and rollback", "Encrypt", "Backup"],
    answer: "Detect and rollback",
    category: "Database Administration & Management"
  },
  {
    id: 762,
    question: "What is database normalization?",
    options: ["Standardizing keyboards", "Organizing data to reduce redundancy and improve integrity", "Encryption", "Compressing data"],
    answer: "Organizing data to reduce redundancy and improve integrity",
    category: "Database Administration & Management"
  },
  {
    id: 763,
    question: "What is denormalization?",
    options: ["Adding redundancy intentionally to improve read performance", "Encrypting tables", "Removing all data", "Splitting tables"],
    answer: "Adding redundancy intentionally to improve read performance",
    category: "Database Administration & Management"
  },
  {
    id: 764,
    question: "What is an index used for?",
    options: ["Storing data", "Speeding up data retrieval", "Encrypting data", "Backup"],
    answer: "Speeding up data retrieval",
    category: "Database Administration & Management"
  },
  {
    id: 765,
    question: "Which type of index physically orders the table?",
    options: ["Non-clustered", "Clustered", "Hash", "Bitmap"],
    answer: "Clustered",
    category: "Database Administration & Management"
  },
  {
    id: 766,
    question: "How many clustered indexes can a table have?",
    options: ["1", "2", "Unlimited", "0"],
    answer: "1",
    category: "Database Administration & Management"
  },
  {
    id: 767,
    question: "What is a stored procedure?",
    options: ["A table", "A precompiled set of SQL statements stored in the database", "A backup", "A schema"],
    answer: "A precompiled set of SQL statements stored in the database",
    category: "Database Administration & Management"
  },
  {
    id: 768,
    question: "What is a trigger in SQL?",
    options: ["A button", "A procedure that runs automatically in response to events on a table", "A backup", "A schema"],
    answer: "A procedure that runs automatically in response to events on a table",
    category: "Database Administration & Management"
  },
  {
    id: 769,
    question: "What is database replication?",
    options: ["Encrypting data", "Copying and synchronizing data across multiple databases", "Creating a backup once", "Indexing"],
    answer: "Copying and synchronizing data across multiple databases",
    category: "Database Administration & Management"
  },
  {
    id: 770,
    question: "What is a data warehouse?",
    options: ["A storage building", "A central repository for analyzing historical data", "A web server", "A backup tool"],
    answer: "A central repository for analyzing historical data",
    category: "Database Administration & Management"
  },
  {
    id: 771,
    question: "What is OLTP?",
    options: ["Online Transaction Processing — handling many short transactions", "Online Test Plan", "Online Trading Platform", "Open Logic Transfer Protocol"],
    answer: "Online Transaction Processing — handling many short transactions",
    category: "Database Administration & Management"
  },
  {
    id: 772,
    question: "What is OLAP?",
    options: ["Online Analytical Processing — for analyzing data", "Online Audit Logging Plan", "Open Library Access Protocol", "Online Application Process"],
    answer: "Online Analytical Processing — for analyzing data",
    category: "Database Administration & Management"
  },
  {
    id: 773,
    question: "What is a database backup?",
    options: ["A copy of database data for recovery", "Original data", "An OS", "A query"],
    answer: "A copy of database data for recovery",
    category: "Database Administration & Management"
  },
  {
    id: 774,
    question: "What is point-in-time recovery?",
    options: ["Restoring a database to a specific moment in time", "Backing up once", "Indexing", "Schema design"],
    answer: "Restoring a database to a specific moment in time",
    category: "Database Administration & Management"
  },
  {
    id: 775,
    question: "Which file type stores transaction history in many DBMSs?",
    options: ["Log file", "Image file", "Text file", "PDF"],
    answer: "Log file",
    category: "Database Administration & Management"
  },
  {
    id: 776,
    question: "What is a tablespace?",
    options: ["A column", "A logical storage container in databases like Oracle", "A backup file", "A query type"],
    answer: "A logical storage container in databases like Oracle",
    category: "Database Administration & Management"
  },
  {
    id: 777,
    question: "What does DBA monitor for performance?",
    options: ["Only CPU", "Query response time, throughput, locks, I/O, etc.", "Only RAM", "Only disk size"],
    answer: "Query response time, throughput, locks, I/O, etc.",
    category: "Database Administration & Management"
  },
  {
    id: 778,
    question: "What is query optimization?",
    options: ["Writing shorter queries", "Improving query execution plans for performance", "Encrypting queries", "Compressing"],
    answer: "Improving query execution plans for performance",
    category: "Database Administration & Management"
  },
  {
    id: 779,
    question: "What is an execution plan?",
    options: ["A schedule for the DBA", "How the database plans to execute a query (steps and costs)", "A backup plan", "A schema"],
    answer: "How the database plans to execute a query (steps and costs)",
    category: "Database Administration & Management"
  },
  {
    id: 780,
    question: "What is sharding?",
    options: ["Encryption", "Splitting a database horizontally across servers for scalability", "Replication", "Caching"],
    answer: "Splitting a database horizontally across servers for scalability",
    category: "Database Administration & Management"
  },
  {
    id: 781,
    question: "What is a NoSQL database?",
    options: ["A database that doesn't use SQL exclusively, often non-relational", "A failed SQL", "A backup", "An indexed relational DB"],
    answer: "A database that doesn't use SQL exclusively, often non-relational",
    category: "Database Administration & Management"
  },
  {
    id: 782,
    question: "Which is a NoSQL database?",
    options: ["MongoDB", "Oracle", "MySQL", "PostgreSQL"],
    answer: "MongoDB",
    category: "Database Administration & Management"
  },
  {
    id: 783,
    question: "What is connection pooling?",
    options: ["Sharing a swimming pool", "Reusing existing database connections to improve performance", "Encrypting connections", "A backup"],
    answer: "Reusing existing database connections to improve performance",
    category: "Database Administration & Management"
  },
  {
    id: 784,
    question: "What is data integrity?",
    options: ["Data consistency and accuracy", "Data loss", "Data backup only", "Compression"],
    answer: "Data consistency and accuracy",
    category: "Database Administration & Management"
  },
  {
    id: 785,
    question: "What is referential integrity?",
    options: ["Foreign key relationships are valid (no orphan records)", "Data is encrypted", "Data is compressed", "Data is backed up"],
    answer: "Foreign key relationships are valid (no orphan records)",
    category: "Database Administration & Management"
  },
  {
    id: 786,
    question: "Which is a database security best practice?",
    options: ["Sharing passwords", "Using least privilege access", "Using same password everywhere", "No authentication"],
    answer: "Using least privilege access",
    category: "Database Administration & Management"
  },
  {
    id: 787,
    question: "What is encryption at rest?",
    options: ["Encrypting data while it is being moved", "Encrypting stored data on disk", "Encrypting RAM only", "Compressing data"],
    answer: "Encrypting stored data on disk",
    category: "Database Administration & Management"
  },
  {
    id: 788,
    question: "What is a database role?",
    options: ["A movie role", "A named collection of privileges that can be assigned to users", "A column", "A trigger"],
    answer: "A named collection of privileges that can be assigned to users",
    category: "Database Administration & Management"
  },
  {
    id: 789,
    question: "What is auditing in databases?",
    options: ["Counting rows", "Recording user actions for security and compliance review", "Encryption", "A backup"],
    answer: "Recording user actions for security and compliance review",
    category: "Database Administration & Management"
  },
  {
    id: 790,
    question: "What is a snapshot?",
    options: ["A photo", "A read-only copy of database state at a point in time", "A backup tool only", "A log entry"],
    answer: "A read-only copy of database state at a point in time",
    category: "Database Administration & Management"
  },
  {
    id: 791,
    question: "What is database failover?",
    options: ["A successful query", "Automatic switching to a standby database when primary fails", "A backup", "An index"],
    answer: "Automatic switching to a standby database when primary fails",
    category: "Database Administration & Management"
  },
  {
    id: 792,
    question: "What does HA (High Availability) mean for DBs?",
    options: ["Always offline", "Designs that minimize downtime and ensure DB stays accessible", "A backup", "An index type"],
    answer: "Designs that minimize downtime and ensure DB stays accessible",
    category: "Database Administration & Management"
  },
  {
    id: 793,
    question: "What is a hot backup?",
    options: ["A backup taken while the database is running", "An offline backup", "A test backup", "An archived backup"],
    answer: "A backup taken while the database is running",
    category: "Database Administration & Management"
  },
  {
    id: 794,
    question: "What is a cold backup?",
    options: ["A backup taken while the database is shut down", "Online backup", "Hot backup", "Cloud backup"],
    answer: "A backup taken while the database is shut down",
    category: "Database Administration & Management"
  },
  {
    id: 795,
    question: "Which language is used for DB structure changes?",
    options: ["DML", "DDL", "DCL", "TCL"],
    answer: "DDL",
    category: "Database Administration & Management"
  },
  {
    id: 796,
    question: "Which language is used for data manipulation?",
    options: ["DDL", "DML", "DCL", "DQL"],
    answer: "DML",
    category: "Database Administration & Management"
  },
  {
    id: 797,
    question: "Which language is used for granting permissions?",
    options: ["DDL", "DML", "DCL", "TCL"],
    answer: "DCL",
    category: "Database Administration & Management"
  },
  {
    id: 798,
    question: "What does TCL stand for in SQL?",
    options: ["Transaction Control Language", "Tabular Control Language", "Type Control Language", "Test Control Language"],
    answer: "Transaction Control Language",
    category: "Database Administration & Management"
  },
  {
    id: 799,
    question: "Which is a TCL command?",
    options: ["SELECT", "COMMIT", "CREATE", "DELETE"],
    answer: "COMMIT",
    category: "Database Administration & Management"
  },
  {
    id: 800,
    question: "What is a savepoint?",
    options: ["A scoring point", "A point within a transaction to which you can roll back", "A backup", "A trigger"],
    answer: "A point within a transaction to which you can roll back",
    category: "Database Administration & Management"
  },
  {
    id: 801,
    question: "What is visual programming?",
    options: ["Drawing pictures", "Programming using graphical elements rather than only text", "3D modeling", "Photography"],
    answer: "Programming using graphical elements rather than only text",
    category: "Visual Programming"
  },
  {
    id: 802,
    question: "Which is a popular visual programming environment for kids?",
    options: ["Scratch", "Java", "C", "Assembly"],
    answer: "Scratch",
    category: "Visual Programming"
  },
  {
    id: 803,
    question: "What does GUI stand for?",
    options: ["Graphical User Interface", "General Universal Input", "Global User Identity", "Graphic Utility Index"],
    answer: "Graphical User Interface",
    category: "Visual Programming"
  },
  {
    id: 804,
    question: "Which language/framework is often used for Windows GUI apps?",
    options: ["WinForms / WPF (.NET)", "MySQL", "JSON", "CSS"],
    answer: "WinForms / WPF (.NET)",
    category: "Visual Programming"
  },
  {
    id: 805,
    question: "Which IDE is associated with Microsoft Visual languages?",
    options: ["Visual Studio", "Eclipse", "Atom", "Brackets"],
    answer: "Visual Studio",
    category: "Visual Programming"
  },
  {
    id: 806,
    question: "What is an event in event-driven programming?",
    options: ["A holiday", "A signal triggered by user action or system change handled by code", "A loop", "A class"],
    answer: "A signal triggered by user action or system change handled by code",
    category: "Visual Programming"
  },
  {
    id: 807,
    question: "Which is an example of an event?",
    options: ["Button click", "A class declaration", "A constant value", "A header file"],
    answer: "Button click",
    category: "Visual Programming"
  },
  {
    id: 808,
    question: "What is a control in visual programming?",
    options: ["A controller", "A reusable UI element like a button, label, textbox", "A loop", "A function"],
    answer: "A reusable UI element like a button, label, textbox",
    category: "Visual Programming"
  },
  {
    id: 809,
    question: "Which is a basic GUI control?",
    options: ["Button", "Pointer", "Compiler", "Linker"],
    answer: "Button",
    category: "Visual Programming"
  },
  {
    id: 810,
    question: "What is a property in a GUI control?",
    options: ["A method", "An attribute that defines the appearance/behavior (e.g., Text, Color)", "An event", "A class"],
    answer: "An attribute that defines the appearance/behavior (e.g., Text, Color)",
    category: "Visual Programming"
  },
  {
    id: 811,
    question: "Which language is C# typically used with for Windows desktop apps?",
    options: ["WinForms / WPF", "MySQL", "OpenGL", "Bash"],
    answer: "WinForms / WPF",
    category: "Visual Programming"
  },
  {
    id: 812,
    question: "What is XAML used for?",
    options: ["Database queries", "Defining UI in WPF / UWP applications", "Compiling code", "Logging"],
    answer: "Defining UI in WPF / UWP applications",
    category: "Visual Programming"
  },
  {
    id: 813,
    question: "Which event fires when a user clicks a button?",
    options: ["Click", "MouseEnter", "Load", "KeyDown"],
    answer: "Click",
    category: "Visual Programming"
  },
  {
    id: 814,
    question: "Which event fires when a form first loads?",
    options: ["Click", "Load", "Resize", "Closed"],
    answer: "Load",
    category: "Visual Programming"
  },
  {
    id: 815,
    question: "What is a form in visual programming?",
    options: ["A document", "A window/container that holds UI controls", "A class only", "A database table"],
    answer: "A window/container that holds UI controls",
    category: "Visual Programming"
  },
  {
    id: 816,
    question: "What does drag-and-drop refer to in visual programming?",
    options: ["Moving files only", "Placing UI elements visually onto a form/canvas", "Copying code", "A debugging step"],
    answer: "Placing UI elements visually onto a form/canvas",
    category: "Visual Programming"
  },
  {
    id: 817,
    question: "What is the purpose of an event handler?",
    options: ["A logger", "Code that runs in response to an event", "A constructor", "A destructor"],
    answer: "Code that runs in response to an event",
    category: "Visual Programming"
  },
  {
    id: 818,
    question: "Which control allows users to enter text?",
    options: ["Button", "Label", "TextBox", "ProgressBar"],
    answer: "TextBox",
    category: "Visual Programming"
  },
  {
    id: 819,
    question: "Which control displays static read-only text?",
    options: ["Label", "TextBox", "Button", "ListBox"],
    answer: "Label",
    category: "Visual Programming"
  },
  {
    id: 820,
    question: "Which control offers a list of items to choose from?",
    options: ["Button", "Label", "ComboBox / ListBox", "TextBox"],
    answer: "ComboBox / ListBox",
    category: "Visual Programming"
  },
  {
    id: 821,
    question: "Which control shows progress of a long task?",
    options: ["Label", "ProgressBar", "Button", "Timer"],
    answer: "ProgressBar",
    category: "Visual Programming"
  },
  {
    id: 822,
    question: "What is data binding in visual programming?",
    options: ["Encrypting data", "Linking UI elements to a data source so they update automatically", "Compiling data", "Backing up data"],
    answer: "Linking UI elements to a data source so they update automatically",
    category: "Visual Programming"
  },
  {
    id: 823,
    question: "Which design pattern is common in WPF?",
    options: ["MVC", "MVVM", "Singleton", "Observer only"],
    answer: "MVVM",
    category: "Visual Programming"
  },
  {
    id: 824,
    question: "What does MVVM stand for?",
    options: ["Model-View-ViewModel", "Model-View-Visual-Module", "Module Visual View Model", "Model Variable View Module"],
    answer: "Model-View-ViewModel",
    category: "Visual Programming"
  },
  {
    id: 825,
    question: "What is a layout manager?",
    options: ["A person", "A component that arranges UI elements automatically", "A compiler", "A debugger"],
    answer: "A component that arranges UI elements automatically",
    category: "Visual Programming"
  },
  {
    id: 826,
    question: "Which technology is used for cross-platform desktop apps with web tech?",
    options: ["Electron", "WPF", "WinForms", "Cocoa"],
    answer: "Electron",
    category: "Visual Programming"
  },
  {
    id: 827,
    question: "Which framework is commonly used for cross-platform mobile UIs from .NET?",
    options: ["MAUI / Xamarin", "Cocoa", "Win32", "Java AWT"],
    answer: "MAUI / Xamarin",
    category: "Visual Programming"
  },
  {
    id: 828,
    question: "Which language is JavaFX based on?",
    options: ["Java", "Python", "C", "JavaScript"],
    answer: "Java",
    category: "Visual Programming"
  },
  {
    id: 829,
    question: "What is the IDE for Java GUI development?",
    options: ["IntelliJ IDEA / Eclipse / NetBeans", "Visual Studio", "Xcode", "Notepad"],
    answer: "IntelliJ IDEA / Eclipse / NetBeans",
    category: "Visual Programming"
  },
  {
    id: 830,
    question: "Which Java library provides modern GUI components?",
    options: ["AWT", "Swing", "JavaFX", "All of the above"],
    answer: "All of the above",
    category: "Visual Programming"
  },
  {
    id: 831,
    question: "What is the purpose of a designer view in IDEs?",
    options: ["Displaying logs", "Letting developers visually design UI without writing code manually", "Compiling code", "Running tests"],
    answer: "Letting developers visually design UI without writing code manually",
    category: "Visual Programming"
  },
  {
    id: 832,
    question: "What is a callback function?",
    options: ["A function called by another function (often after an event/operation)", "A constructor", "A static method", "A destructor"],
    answer: "A function called by another function (often after an event/operation)",
    category: "Visual Programming"
  },
  {
    id: 833,
    question: "What is a modal dialog?",
    options: ["A non-blocking window", "A window that blocks interaction with the rest of the app until dismissed", "A toast", "A tooltip"],
    answer: "A window that blocks interaction with the rest of the app until dismissed",
    category: "Visual Programming"
  },
  {
    id: 834,
    question: "What is a tooltip?",
    options: ["A small popup with hint text on hover", "A modal", "A button", "A status bar"],
    answer: "A small popup with hint text on hover",
    category: "Visual Programming"
  },
  {
    id: 835,
    question: "What is a status bar?",
    options: ["A drinking establishment", "A UI element at the bottom showing app state info", "A toolbar", "A menu"],
    answer: "A UI element at the bottom showing app state info",
    category: "Visual Programming"
  },
  {
    id: 836,
    question: "Which event is triggered when text changes in a textbox?",
    options: ["TextChanged", "Click", "Load", "Closed"],
    answer: "TextChanged",
    category: "Visual Programming"
  },
  {
    id: 837,
    question: "Which event fires when a key is pressed?",
    options: ["Click", "KeyPress / KeyDown", "Resize", "Load"],
    answer: "KeyPress / KeyDown",
    category: "Visual Programming"
  },
  {
    id: 838,
    question: "What is GDI+ in Windows?",
    options: ["A database", "An API for 2D graphics rendering", "A shell", "A network library"],
    answer: "An API for 2D graphics rendering",
    category: "Visual Programming"
  },
  {
    id: 839,
    question: "Which property of a Button changes its visible label?",
    options: ["Caption / Text", "Color", "Size", "Visible"],
    answer: "Caption / Text",
    category: "Visual Programming"
  },
  {
    id: 840,
    question: "What is anchoring/docking?",
    options: ["A boat term only", "A way to control how controls resize/position with their container", "A debugging trick", "A compiling option"],
    answer: "A way to control how controls resize/position with their container",
    category: "Visual Programming"
  },
  {
    id: 841,
    question: "Which control is used for selecting one option from many?",
    options: ["RadioButton", "Checkbox", "Button", "Label"],
    answer: "RadioButton",
    category: "Visual Programming"
  },
  {
    id: 842,
    question: "Which control allows multiple selections?",
    options: ["RadioButton", "Checkbox", "Button", "Label"],
    answer: "Checkbox",
    category: "Visual Programming"
  },
  {
    id: 843,
    question: "What is an MDI form?",
    options: ["A simple form", "Multiple Document Interface — a form that hosts child windows", "A chart", "A status bar"],
    answer: "Multiple Document Interface — a form that hosts child windows",
    category: "Visual Programming"
  },
  {
    id: 844,
    question: "Which control is typically used for showing tabular data?",
    options: ["DataGridView / DataGrid", "Label", "Button", "ProgressBar"],
    answer: "DataGridView / DataGrid",
    category: "Visual Programming"
  },
  {
    id: 845,
    question: "Which file format does .NET often use for resources?",
    options: ["RESX", "DOCX", "PNG only", "EXE"],
    answer: "RESX",
    category: "Visual Programming"
  },
  {
    id: 846,
    question: "What is exception handling in visual programming?",
    options: ["Avoiding exceptions", "Code structures (try/catch) that handle runtime errors", "A class definition", "A database query"],
    answer: "Code structures (try/catch) that handle runtime errors",
    category: "Visual Programming"
  },
  {
    id: 847,
    question: "Which keyword catches an exception in C#?",
    options: ["except", "catch", "rescue", "handle"],
    answer: "catch",
    category: "Visual Programming"
  },
  {
    id: 848,
    question: "Which keyword guarantees code runs whether or not an exception occurred?",
    options: ["finally", "always", "ensure", "catch"],
    answer: "finally",
    category: "Visual Programming"
  },
  {
    id: 849,
    question: "What is a Timer control used for?",
    options: ["Displaying time", "Triggering events at specified intervals", "Showing progress", "Validating inputs"],
    answer: "Triggering events at specified intervals",
    category: "Visual Programming"
  },
  {
    id: 850,
    question: "Which is NOT typically a property of a control?",
    options: ["Text", "Color", "Size", "ExecuteSQL"],
    answer: "ExecuteSQL",
    category: "Visual Programming"
  },
  {
    id: 851,
    question: "What is mobile application development?",
    options: ["Building hardware phones", "The process of creating software for mobile devices", "Selling apps", "Repairing phones"],
    answer: "The process of creating software for mobile devices",
    category: "Mobile Application Development"
  },
  {
    id: 852,
    question: "Which OS does the iPhone use?",
    options: ["Android", "iOS", "Windows Phone", "Linux"],
    answer: "iOS",
    category: "Mobile Application Development"
  },
  {
    id: 853,
    question: "Which company develops Android?",
    options: ["Microsoft", "Google", "Apple", "Samsung"],
    answer: "Google",
    category: "Mobile Application Development"
  },
  {
    id: 854,
    question: "Which language is primarily used for native iOS development?",
    options: ["Java", "Swift / Objective-C", "Kotlin", "C#"],
    answer: "Swift / Objective-C",
    category: "Mobile Application Development"
  },
  {
    id: 855,
    question: "Which language is primarily used for native Android development?",
    options: ["Swift", "Java / Kotlin", "C#", "Python"],
    answer: "Java / Kotlin",
    category: "Mobile Application Development"
  },
  {
    id: 856,
    question: "Which IDE is used for native Android development?",
    options: ["Xcode", "Android Studio", "Visual Studio", "Eclipse"],
    answer: "Android Studio",
    category: "Mobile Application Development"
  },
  {
    id: 857,
    question: "Which IDE is used for native iOS development?",
    options: ["Xcode", "Android Studio", "Eclipse", "IntelliJ"],
    answer: "Xcode",
    category: "Mobile Application Development"
  },
  {
    id: 858,
    question: "What is a hybrid mobile app?",
    options: ["A bicycle app", "An app built with web technologies wrapped in a native container", "A native iOS app", "A desktop app"],
    answer: "An app built with web technologies wrapped in a native container",
    category: "Mobile Application Development"
  },
  {
    id: 859,
    question: "Which framework is popular for cross-platform mobile development with JavaScript?",
    options: ["React Native", "Cocoa", "Win32", "Swing"],
    answer: "React Native",
    category: "Mobile Application Development"
  },
  {
    id: 860,
    question: "Which framework by Google enables cross-platform apps using Dart?",
    options: ["Flutter", "Ionic", "Xamarin", "Cordova"],
    answer: "Flutter",
    category: "Mobile Application Development"
  },
  {
    id: 861,
    question: "What is an APK?",
    options: ["An iOS package", "Android Package — installation file format for Android apps", "A protocol", "A compiler"],
    answer: "Android Package — installation file format for Android apps",
    category: "Mobile Application Development"
  },
  {
    id: 862,
    question: "What is an IPA file?",
    options: ["An Android package", "iOS App Store package format", "An image file", "A video format"],
    answer: "iOS App Store package format",
    category: "Mobile Application Development"
  },
  {
    id: 863,
    question: "Which file describes an Android app's permissions and components?",
    options: ["AndroidManifest.xml", "Info.plist", "package.json", "config.xml"],
    answer: "AndroidManifest.xml",
    category: "Mobile Application Development"
  },
  {
    id: 864,
    question: "Which file holds an iOS app's metadata?",
    options: ["AndroidManifest.xml", "Info.plist", "AppConfig.xml", "main.swift"],
    answer: "Info.plist",
    category: "Mobile Application Development"
  },
  {
    id: 865,
    question: "What is an Activity in Android?",
    options: ["A workout", "A single screen with a user interface", "A service", "A database"],
    answer: "A single screen with a user interface",
    category: "Mobile Application Development"
  },
  {
    id: 866,
    question: "What is a Fragment in Android?",
    options: ["A reusable portion of UI within an Activity", "An entire app", "A database", "A permission"],
    answer: "A reusable portion of UI within an Activity",
    category: "Mobile Application Development"
  },
  {
    id: 867,
    question: "What is an Intent in Android?",
    options: ["A user goal", "A messaging object used to request an action from another component", "A class", "A view"],
    answer: "A messaging object used to request an action from another component",
    category: "Mobile Application Development"
  },
  {
    id: 868,
    question: "Which view controller concept is used in iOS?",
    options: ["UIViewController", "Activity", "Fragment", "Form"],
    answer: "UIViewController",
    category: "Mobile Application Development"
  },
  {
    id: 869,
    question: "What is the iOS UI framework?",
    options: ["UIKit / SwiftUI", "Android Views", "WPF", "WinForms"],
    answer: "UIKit / SwiftUI",
    category: "Mobile Application Development"
  },
  {
    id: 870,
    question: "Which database is commonly bundled with mobile apps for local storage?",
    options: ["SQLite", "Oracle", "MS SQL Server", "DB2"],
    answer: "SQLite",
    category: "Mobile Application Development"
  },
  {
    id: 871,
    question: "What is Firebase?",
    options: ["A web browser", "A Google platform offering backend services for mobile apps", "An IDE", "A language"],
    answer: "A Google platform offering backend services for mobile apps",
    category: "Mobile Application Development"
  },
  {
    id: 872,
    question: "What does push notification mean?",
    options: ["Pushing buttons", "Server-initiated message delivered to a mobile device", "Pull-to-refresh", "An ad"],
    answer: "Server-initiated message delivered to a mobile device",
    category: "Mobile Application Development"
  },
  {
    id: 873,
    question: "Which service handles push notifications on Android?",
    options: ["FCM (Firebase Cloud Messaging)", "APNs", "iCloud", "DropBox"],
    answer: "FCM (Firebase Cloud Messaging)",
    category: "Mobile Application Development"
  },
  {
    id: 874,
    question: "Which service handles push notifications on iOS?",
    options: ["FCM", "APNs (Apple Push Notification service)", "iCloud", "OneSignal only"],
    answer: "APNs (Apple Push Notification service)",
    category: "Mobile Application Development"
  },
  {
    id: 875,
    question: "What is responsive design in mobile?",
    options: ["A fast app", "Layout that adapts to different screen sizes and orientations", "A dark theme", "A native UI only"],
    answer: "Layout that adapts to different screen sizes and orientations",
    category: "Mobile Application Development"
  },
  {
    id: 876,
    question: "What is a layout in Android?",
    options: ["A class", "A definition of UI structure (XML or Compose)", "A database", "A service"],
    answer: "A definition of UI structure (XML or Compose)",
    category: "Mobile Application Development"
  },
  {
    id: 877,
    question: "Which UI element shows a vertically scrollable list in Android?",
    options: ["Spinner", "RecyclerView / ListView", "ImageView", "ProgressBar"],
    answer: "RecyclerView / ListView",
    category: "Mobile Application Development"
  },
  {
    id: 878,
    question: "Which iOS UI element shows a list?",
    options: ["UITableView / UICollectionView", "RecyclerView", "Spinner", "Picker"],
    answer: "UITableView / UICollectionView",
    category: "Mobile Application Development"
  },
  {
    id: 879,
    question: "What is the lifecycle method called when an Android Activity is first created?",
    options: ["onStart()", "onCreate()", "onResume()", "onPause()"],
    answer: "onCreate()",
    category: "Mobile Application Development"
  },
  {
    id: 880,
    question: "Which iOS lifecycle method is called when a view loads?",
    options: ["viewDidLoad()", "onCreate()", "init()", "main()"],
    answer: "viewDidLoad()",
    category: "Mobile Application Development"
  },
  {
    id: 881,
    question: "What is GPS used for in mobile apps?",
    options: ["Global Positioning System — providing location data", "Game Pad System", "General Phone Service", "Graphics Processing Speed"],
    answer: "Global Positioning System — providing location data",
    category: "Mobile Application Development"
  },
  {
    id: 882,
    question: "Which sensor measures device orientation?",
    options: ["GPS", "Gyroscope / Accelerometer", "Microphone", "Camera"],
    answer: "Gyroscope / Accelerometer",
    category: "Mobile Application Development"
  },
  {
    id: 883,
    question: "What is an emulator?",
    options: ["A real phone", "Software simulating a mobile device for testing", "A debugger only", "A compiler"],
    answer: "Software simulating a mobile device for testing",
    category: "Mobile Application Development"
  },
  {
    id: 884,
    question: "What is the Google Play Store?",
    options: ["A music store", "Google's official app distribution platform for Android", "A search engine", "An email service"],
    answer: "Google's official app distribution platform for Android",
    category: "Mobile Application Development"
  },
  {
    id: 885,
    question: "What is the Apple App Store?",
    options: ["Apple's official iOS app distribution platform", "A music store", "A movie store", "A social network"],
    answer: "Apple's official iOS app distribution platform",
    category: "Mobile Application Development"
  },
  {
    id: 886,
    question: "What is in-app purchase?",
    options: ["A real-world purchase", "Buying digital goods/services within an app", "An ad service", "An update method"],
    answer: "Buying digital goods/services within an app",
    category: "Mobile Application Development"
  },
  {
    id: 887,
    question: "Which is a popular cross-platform IDE for hybrid apps?",
    options: ["Visual Studio Code", "Notepad", "Outlook", "Photoshop"],
    answer: "Visual Studio Code",
    category: "Mobile Application Development"
  },
  {
    id: 888,
    question: "Which language does Flutter use?",
    options: ["JavaScript", "Dart", "Kotlin", "Swift"],
    answer: "Dart",
    category: "Mobile Application Development"
  },
  {
    id: 889,
    question: "What is an SDK?",
    options: ["Software Development Kit", "System Disk", "Standard Data Kit", "Secure Database Key"],
    answer: "Software Development Kit",
    category: "Mobile Application Development"
  },
  {
    id: 890,
    question: "Which permission is required for location in Android?",
    options: ["INTERNET", "ACCESS_FINE_LOCATION", "READ_CONTACTS", "CAMERA"],
    answer: "ACCESS_FINE_LOCATION",
    category: "Mobile Application Development"
  },
  {
    id: 891,
    question: "Which file in iOS apps lists required permissions/usage descriptions?",
    options: ["Info.plist", "AndroidManifest.xml", "main.cpp", "package.json"],
    answer: "Info.plist",
    category: "Mobile Application Development"
  },
  {
    id: 892,
    question: "What is API rate limiting?",
    options: ["Encrypting APIs", "Limiting how often a client can call an API", "Caching", "Logging"],
    answer: "Limiting how often a client can call an API",
    category: "Mobile Application Development"
  },
  {
    id: 893,
    question: "What is a REST API?",
    options: ["A nap", "An architectural style for web services using HTTP methods", "A database", "A file format"],
    answer: "An architectural style for web services using HTTP methods",
    category: "Mobile Application Development"
  },
  {
    id: 894,
    question: "Which HTTP method retrieves data?",
    options: ["GET", "POST", "DELETE", "PUT"],
    answer: "GET",
    category: "Mobile Application Development"
  },
  {
    id: 895,
    question: "Which HTTP method submits data to create a resource?",
    options: ["GET", "POST", "DELETE", "OPTIONS"],
    answer: "POST",
    category: "Mobile Application Development"
  },
  {
    id: 896,
    question: "What is JSON?",
    options: ["A programming language", "A lightweight data interchange format", "A database", "A query language"],
    answer: "A lightweight data interchange format",
    category: "Mobile Application Development"
  },
  {
    id: 897,
    question: "Which library is used in Android for HTTP requests?",
    options: ["Retrofit / OkHttp", "JDBC", "ADO.NET", "Win32"],
    answer: "Retrofit / OkHttp",
    category: "Mobile Application Development"
  },
  {
    id: 898,
    question: "Which library is used in iOS for HTTP requests?",
    options: ["URLSession / Alamofire", "Retrofit", "Volley", "Glide"],
    answer: "URLSession / Alamofire",
    category: "Mobile Application Development"
  },
  {
    id: 899,
    question: "What does responsive UI mean for tablets and phones?",
    options: ["Single fixed layout", "UI that adapts to varied screen sizes and aspect ratios", "Only landscape", "Only portrait"],
    answer: "UI that adapts to varied screen sizes and aspect ratios",
    category: "Mobile Application Development"
  },
  {
    id: 900,
    question: "What is a splash screen?",
    options: ["A loading screen shown briefly when an app starts", "A login screen", "A settings screen", "An error screen"],
    answer: "A loading screen shown briefly when an app starts",
    category: "Mobile Application Development"
  },
  {
    id: 901,
    question: "What is a virtual machine (VM)?",
    options: ["A physical PC", "A software emulation of a physical computer", "A robot", "A hard disk"],
    answer: "A software emulation of a physical computer",
    category: "Virtual Systems and Services"
  },
  {
    id: 902,
    question: "What is the role of a hypervisor?",
    options: ["Compresses files", "Manages and creates virtual machines on a host", "Logs events", "Runs antivirus"],
    answer: "Manages and creates virtual machines on a host",
    category: "Virtual Systems and Services"
  },
  {
    id: 903,
    question: "Type 1 hypervisor is also known as:",
    options: ["Hosted hypervisor", "Bare-metal hypervisor", "Software hypervisor", "Virtual hypervisor"],
    answer: "Bare-metal hypervisor",
    category: "Virtual Systems and Services"
  },
  {
    id: 904,
    question: "Type 2 hypervisor is also known as:",
    options: ["Bare-metal", "Hosted", "Cloud", "Embedded"],
    answer: "Hosted",
    category: "Virtual Systems and Services"
  },
  {
    id: 905,
    question: "Which is a Type 2 hypervisor?",
    options: ["VMware ESXi", "Microsoft Hyper-V Server", "VirtualBox", "Xen Server"],
    answer: "VirtualBox",
    category: "Virtual Systems and Services"
  },
  {
    id: 906,
    question: "What is server virtualization?",
    options: ["Running multiple virtual servers on one physical server", "Selling servers", "Cloud storage", "Backing up servers"],
    answer: "Running multiple virtual servers on one physical server",
    category: "Virtual Systems and Services"
  },
  {
    id: 907,
    question: "Which is an advantage of virtualization?",
    options: ["Higher hardware cost", "Better resource utilization", "More physical space", "Slower performance"],
    answer: "Better resource utilization",
    category: "Virtual Systems and Services"
  },
  {
    id: 908,
    question: "What is desktop virtualization (VDI)?",
    options: ["Painting a desktop", "Hosting desktop environments on a centralized server", "A printer feature", "A mobile app"],
    answer: "Hosting desktop environments on a centralized server",
    category: "Virtual Systems and Services"
  },
  {
    id: 909,
    question: "What is application virtualization?",
    options: ["Encrypting apps", "Running an application in an isolated environment, separate from the OS", "A backup", "Compiling apps"],
    answer: "Running an application in an isolated environment, separate from the OS",
    category: "Virtual Systems and Services"
  },
  {
    id: 910,
    question: "What is a snapshot in virtualization?",
    options: ["A photo", "A saved state of a VM at a particular moment", "A backup file", "A schema"],
    answer: "A saved state of a VM at a particular moment",
    category: "Virtual Systems and Services"
  },
  {
    id: 911,
    question: "What is VM live migration?",
    options: ["Moving a running VM from one host to another with minimal downtime", "Backing up VMs", "Cloning a VM", "Deleting a VM"],
    answer: "Moving a running VM from one host to another with minimal downtime",
    category: "Virtual Systems and Services"
  },
  {
    id: 912,
    question: "What is virtual storage?",
    options: ["Storage abstraction that pools physical resources into virtual volumes", "A USB drive", "RAM only", "An OS feature only"],
    answer: "Storage abstraction that pools physical resources into virtual volumes",
    category: "Virtual Systems and Services"
  },
  {
    id: 913,
    question: "What is network virtualization?",
    options: ["Drawing networks", "Combining hardware/software resources into a virtual network", "DNS lookups", "Routing protocols"],
    answer: "Combining hardware/software resources into a virtual network",
    category: "Virtual Systems and Services"
  },
  {
    id: 914,
    question: "What is SDN?",
    options: ["Software Defined Networking — control plane separated from data plane", "Standard Data Network", "Secure Data Node", "Static Domain Name"],
    answer: "Software Defined Networking — control plane separated from data plane",
    category: "Virtual Systems and Services"
  },
  {
    id: 915,
    question: "What does NFV stand for?",
    options: ["Network Functions Virtualization", "Network Failure Verification", "New Format Variant", "Node Forwarding Vector"],
    answer: "Network Functions Virtualization",
    category: "Virtual Systems and Services"
  },
  {
    id: 916,
    question: "What is a container?",
    options: ["A box", "A lightweight, portable runtime sharing the host OS kernel", "A heavy VM", "A backup"],
    answer: "A lightweight, portable runtime sharing the host OS kernel",
    category: "Virtual Systems and Services"
  },
  {
    id: 917,
    question: "Which is the most popular container platform?",
    options: ["Docker", "VirtualBox", "VMware", "Hyper-V"],
    answer: "Docker",
    category: "Virtual Systems and Services"
  },
  {
    id: 918,
    question: "How does a container differ from a VM?",
    options: ["Containers share the host OS kernel; VMs include a full OS", "Containers are larger", "VMs are lighter", "No difference"],
    answer: "Containers share the host OS kernel; VMs include a full OS",
    category: "Virtual Systems and Services"
  },
  {
    id: 919,
    question: "What is a Docker image?",
    options: ["A picture", "A read-only template used to create containers", "A database file", "A backup"],
    answer: "A read-only template used to create containers",
    category: "Virtual Systems and Services"
  },
  {
    id: 920,
    question: "What is Kubernetes used for?",
    options: ["Image editing", "Orchestrating and managing containerized applications at scale", "A database", "A DNS server"],
    answer: "Orchestrating and managing containerized applications at scale",
    category: "Virtual Systems and Services"
  },
  {
    id: 921,
    question: "What is a Kubernetes pod?",
    options: ["A whale", "The smallest deployable unit, hosting one or more containers", "A virtual disk", "A namespace"],
    answer: "The smallest deployable unit, hosting one or more containers",
    category: "Virtual Systems and Services"
  },
  {
    id: 922,
    question: "What is cloud bursting?",
    options: ["A cloud explosion", "Dynamically using public cloud resources when private cloud capacity is exceeded", "An attack", "A backup process"],
    answer: "Dynamically using public cloud resources when private cloud capacity is exceeded",
    category: "Virtual Systems and Services"
  },
  {
    id: 923,
    question: "Which is a public cloud provider?",
    options: ["AWS, Azure, Google Cloud", "Apache, Nginx, IIS", "Oracle DB only", "MySQL only"],
    answer: "AWS, Azure, Google Cloud",
    category: "Virtual Systems and Services"
  },
  {
    id: 924,
    question: "What is multi-tenancy?",
    options: ["Multiple housing tenants only", "A single instance serving multiple customers (tenants) with isolation", "A cloud failure", "A backup"],
    answer: "A single instance serving multiple customers (tenants) with isolation",
    category: "Virtual Systems and Services"
  },
  {
    id: 925,
    question: "What is elasticity in cloud?",
    options: ["Stretchy material", "Ability to scale resources up or down dynamically", "Static resources", "Backup speed"],
    answer: "Ability to scale resources up or down dynamically",
    category: "Virtual Systems and Services"
  },
  {
    id: 926,
    question: "What is on-demand self-service?",
    options: ["Buying coffee", "User can provision resources automatically without human interaction with the provider", "Manual provisioning", "A type of backup"],
    answer: "User can provision resources automatically without human interaction with the provider",
    category: "Virtual Systems and Services"
  },
  {
    id: 927,
    question: "What is pay-as-you-go pricing?",
    options: ["Free service", "Paying only for the resources you use", "Fixed monthly fee", "One-time payment"],
    answer: "Paying only for the resources you use",
    category: "Virtual Systems and Services"
  },
  {
    id: 928,
    question: "Which protocol enables remote desktop access?",
    options: ["RDP", "FTP", "SMTP", "DNS"],
    answer: "RDP",
    category: "Virtual Systems and Services"
  },
  {
    id: 929,
    question: "Which protocol is used for remote access on Linux/Unix VMs?",
    options: ["RDP", "SSH", "Telnet (insecure)", "FTP"],
    answer: "SSH",
    category: "Virtual Systems and Services"
  },
  {
    id: 930,
    question: "What is a virtual network interface?",
    options: ["A physical NIC", "A software-defined network interface attached to a VM/container", "A USB port", "A monitor"],
    answer: "A software-defined network interface attached to a VM/container",
    category: "Virtual Systems and Services"
  },
  {
    id: 931,
    question: "What is a virtual switch (vSwitch)?",
    options: ["A physical switch", "Software-based switching for VM traffic on a host", "A power switch", "A database trigger"],
    answer: "Software-based switching for VM traffic on a host",
    category: "Virtual Systems and Services"
  },
  {
    id: 932,
    question: "What is paravirtualization?",
    options: ["Running unmodified OSes only", "OS is modified to be aware of the hypervisor for performance", "Native execution", "No virtualization"],
    answer: "OS is modified to be aware of the hypervisor for performance",
    category: "Virtual Systems and Services"
  },
  {
    id: 933,
    question: "What is full virtualization?",
    options: ["Modifying the guest OS", "Guest OS runs unmodified, hypervisor fully simulates hardware", "Container only", "Bare-metal only"],
    answer: "Guest OS runs unmodified, hypervisor fully simulates hardware",
    category: "Virtual Systems and Services"
  },
  {
    id: 934,
    question: "What is hardware-assisted virtualization?",
    options: ["No CPU support", "CPU features (Intel VT-x, AMD-V) accelerate virtualization", "GPU only", "Network only"],
    answer: "CPU features (Intel VT-x, AMD-V) accelerate virtualization",
    category: "Virtual Systems and Services"
  },
  {
    id: 935,
    question: "What is a service mesh?",
    options: ["A wire mesh", "An infrastructure layer for managing service-to-service communication", "A database", "A backup"],
    answer: "An infrastructure layer for managing service-to-service communication",
    category: "Virtual Systems and Services"
  },
  {
    id: 936,
    question: "Which is a popular service mesh?",
    options: ["Istio", "MySQL", "Apache", "Outlook"],
    answer: "Istio",
    category: "Virtual Systems and Services"
  },
  {
    id: 937,
    question: "What is serverless computing?",
    options: ["No servers exist", "A model where the cloud provider manages servers; you run code in functions", "Bare-metal hosting", "Static hosting only"],
    answer: "A model where the cloud provider manages servers; you run code in functions",
    category: "Virtual Systems and Services"
  },
  {
    id: 938,
    question: "Which is a serverless service?",
    options: ["AWS Lambda", "Apache Tomcat", "MySQL", "Outlook"],
    answer: "AWS Lambda",
    category: "Virtual Systems and Services"
  },
  {
    id: 939,
    question: "What is auto-scaling?",
    options: ["Manual provisioning", "Automatically adjusting compute resources based on load", "Backup automation", "Encryption"],
    answer: "Automatically adjusting compute resources based on load",
    category: "Virtual Systems and Services"
  },
  {
    id: 940,
    question: "What is a load balancer?",
    options: ["A weight scale", "A device/service that distributes traffic across multiple servers", "An OS", "A protocol"],
    answer: "A device/service that distributes traffic across multiple servers",
    category: "Virtual Systems and Services"
  },
  {
    id: 941,
    question: "What is data replication in cloud storage?",
    options: ["Copying data across multiple locations for resilience", "Encrypting", "Deleting", "Compressing"],
    answer: "Copying data across multiple locations for resilience",
    category: "Virtual Systems and Services"
  },
  {
    id: 942,
    question: "Which is a benefit of cloud services?",
    options: ["Higher upfront cost", "Reduced capital expenditure", "More physical hardware", "Slower deployments"],
    answer: "Reduced capital expenditure",
    category: "Virtual Systems and Services"
  },
  {
    id: 943,
    question: "What is virtualization sprawl?",
    options: ["Crawling VMs", "Uncontrolled growth of VMs leading to management challenges", "Quick provisioning", "Snapshot deletion"],
    answer: "Uncontrolled growth of VMs leading to management challenges",
    category: "Virtual Systems and Services"
  },
  {
    id: 944,
    question: "What is a tenant in cloud?",
    options: ["A landlord", "A customer or organization sharing the cloud infrastructure", "An OS", "A protocol"],
    answer: "A customer or organization sharing the cloud infrastructure",
    category: "Virtual Systems and Services"
  },
  {
    id: 945,
    question: "What is shared responsibility model?",
    options: ["Customer does everything", "Provider and customer both have defined security responsibilities", "Provider does everything", "No responsibility"],
    answer: "Provider and customer both have defined security responsibilities",
    category: "Virtual Systems and Services"
  },
  {
    id: 946,
    question: "Which is a virtualization use-case?",
    options: ["Server consolidation", "Manual provisioning only", "Reduced flexibility", "Slower deployment"],
    answer: "Server consolidation",
    category: "Virtual Systems and Services"
  },
  {
    id: 947,
    question: "What is a microservice?",
    options: ["A small monolith", "An independently deployable service performing a specific function", "A database", "A protocol"],
    answer: "An independently deployable service performing a specific function",
    category: "Virtual Systems and Services"
  },
  {
    id: 948,
    question: "Which is the opposite of microservices architecture?",
    options: ["Monolithic architecture", "SOA only", "REST", "GraphQL"],
    answer: "Monolithic architecture",
    category: "Virtual Systems and Services"
  },
  {
    id: 949,
    question: "What is a private cloud?",
    options: ["Cloud open to all", "Cloud infrastructure dedicated to a single organization", "Free public cloud", "An OS only"],
    answer: "Cloud infrastructure dedicated to a single organization",
    category: "Virtual Systems and Services"
  },
  {
    id: 950,
    question: "Which is an open-source virtualization platform?",
    options: ["KVM", "Word", "Excel", "Outlook"],
    answer: "KVM",
    category: "Virtual Systems and Services"
  },
  {
    id: 951,
    question: "What is a model in modeling and simulation?",
    options: ["A fashion model", "A simplified representation of a real system", "A spreadsheet", "A blueprint only"],
    answer: "A simplified representation of a real system",
    category: "Modeling and Simulations"
  },
  {
    id: 952,
    question: "What is simulation?",
    options: ["Running a real experiment", "Imitating a system's operation over time using a model", "Building hardware", "Random testing"],
    answer: "Imitating a system's operation over time using a model",
    category: "Modeling and Simulations"
  },
  {
    id: 953,
    question: "Which type of model uses mathematical equations?",
    options: ["Mathematical model", "Physical model", "Graphical model only", "Living model"],
    answer: "Mathematical model",
    category: "Modeling and Simulations"
  },
  {
    id: 954,
    question: "What is a discrete-event simulation?",
    options: ["A continuous simulation", "A simulation where state changes at distinct time points (events)", "A static drawing", "A real experiment"],
    answer: "A simulation where state changes at distinct time points (events)",
    category: "Modeling and Simulations"
  },
  {
    id: 955,
    question: "What is a continuous simulation?",
    options: ["State variables change continuously over time", "Only events", "Static state", "Discrete only"],
    answer: "State variables change continuously over time",
    category: "Modeling and Simulations"
  },
  {
    id: 956,
    question: "Which is an example of a stochastic simulation?",
    options: ["Deterministic process", "Monte Carlo simulation with random variables", "A drawing", "A static spreadsheet"],
    answer: "Monte Carlo simulation with random variables",
    category: "Modeling and Simulations"
  },
  {
    id: 957,
    question: "What is a deterministic model?",
    options: ["Outcomes are exactly determined by initial conditions, no randomness", "Random outcomes", "A real experiment", "A guess"],
    answer: "Outcomes are exactly determined by initial conditions, no randomness",
    category: "Modeling and Simulations"
  },
  {
    id: 958,
    question: "What is a stochastic model?",
    options: ["Has randomness/uncertainty", "Fully deterministic", "Static", "Empty"],
    answer: "Has randomness/uncertainty",
    category: "Modeling and Simulations"
  },
  {
    id: 959,
    question: "What is Monte Carlo method?",
    options: ["Gambling at a casino", "A computational technique using repeated random sampling", "Manual calculation", "A static formula"],
    answer: "A computational technique using repeated random sampling",
    category: "Modeling and Simulations"
  },
  {
    id: 960,
    question: "Why use simulations?",
    options: ["Cheaper to play games", "To study systems where real experimentation is costly, dangerous, or impossible", "To avoid math", "To replace OS"],
    answer: "To study systems where real experimentation is costly, dangerous, or impossible",
    category: "Modeling and Simulations"
  },
  {
    id: 961,
    question: "What is model validation?",
    options: ["Verifying syntax", "Checking that the model accurately represents the real system", "A backup", "A database operation"],
    answer: "Checking that the model accurately represents the real system",
    category: "Modeling and Simulations"
  },
  {
    id: 962,
    question: "What is model verification?",
    options: ["Confirming the model is implemented correctly per specification", "Validation only", "Model design", "User testing"],
    answer: "Confirming the model is implemented correctly per specification",
    category: "Modeling and Simulations"
  },
  {
    id: 963,
    question: "What is a queuing model?",
    options: ["A model of waiting lines/service systems", "A model of meals", "A drawing of cars", "A static dataset"],
    answer: "A model of waiting lines/service systems",
    category: "Modeling and Simulations"
  },
  {
    id: 964,
    question: "What does M/M/1 represent in queuing theory?",
    options: ["A single-server queue with Poisson arrivals and exponential service times", "A web server", "A protocol", "A database"],
    answer: "A single-server queue with Poisson arrivals and exponential service times",
    category: "Modeling and Simulations"
  },
  {
    id: 965,
    question: "What is sensitivity analysis?",
    options: ["Studying how changes in inputs affect outputs", "Encryption", "Compilation", "User testing"],
    answer: "Studying how changes in inputs affect outputs",
    category: "Modeling and Simulations"
  },
  {
    id: 966,
    question: "What is a random number generator (RNG)?",
    options: ["A device producing random numbers", "An algorithm/process generating numbers with statistical properties of randomness", "A backup tool", "An OS"],
    answer: "An algorithm/process generating numbers with statistical properties of randomness",
    category: "Modeling and Simulations"
  },
  {
    id: 967,
    question: "What is a pseudo-random number generator?",
    options: ["A truly random source", "An algorithm that produces sequences appearing random but is deterministic given the seed", "Hardware only", "A database"],
    answer: "An algorithm that produces sequences appearing random but is deterministic given the seed",
    category: "Modeling and Simulations"
  },
  {
    id: 968,
    question: "What does 'seed' mean in simulation?",
    options: ["Plant seeds", "Initial value used to start a pseudo-random sequence", "A backup", "A class"],
    answer: "Initial value used to start a pseudo-random sequence",
    category: "Modeling and Simulations"
  },
  {
    id: 969,
    question: "Which distribution is commonly used to model arrival times in queues?",
    options: ["Poisson", "Uniform", "Bernoulli", "Beta"],
    answer: "Poisson",
    category: "Modeling and Simulations"
  },
  {
    id: 970,
    question: "Which distribution models service times in many queue models?",
    options: ["Exponential", "Uniform", "Binomial", "Geometric"],
    answer: "Exponential",
    category: "Modeling and Simulations"
  },
  {
    id: 971,
    question: "What is system dynamics?",
    options: ["A modeling approach for complex systems with feedback loops over time", "Static modeling", "A database", "An OS"],
    answer: "A modeling approach for complex systems with feedback loops over time",
    category: "Modeling and Simulations"
  },
  {
    id: 972,
    question: "What is agent-based modeling?",
    options: ["Modeling individuals (agents) and their interactions to study system behavior", "Modeling only equations", "Static models", "Database design"],
    answer: "Modeling individuals (agents) and their interactions to study system behavior",
    category: "Modeling and Simulations"
  },
  {
    id: 973,
    question: "Which simulation tool is widely used for general-purpose simulation?",
    options: ["MATLAB / Simulink", "Word", "Excel only", "Outlook"],
    answer: "MATLAB / Simulink",
    category: "Modeling and Simulations"
  },
  {
    id: 974,
    question: "What is Arena software used for?",
    options: ["Sports", "Discrete-event simulation", "Word processing", "Photo editing"],
    answer: "Discrete-event simulation",
    category: "Modeling and Simulations"
  },
  {
    id: 975,
    question: "What is the warm-up period in simulation?",
    options: ["A workout", "Time at the start used to reach steady state, often discarded from results", "A backup", "An error"],
    answer: "Time at the start used to reach steady state, often discarded from results",
    category: "Modeling and Simulations"
  },
  {
    id: 976,
    question: "What is steady state in simulation?",
    options: ["A condition where statistical properties no longer change with time", "An error state", "Initial state", "Final crash"],
    answer: "A condition where statistical properties no longer change with time",
    category: "Modeling and Simulations"
  },
  {
    id: 977,
    question: "What is replication in simulation?",
    options: ["Copying disks", "Running the simulation multiple times with different random seeds", "Backup", "Compilation"],
    answer: "Running the simulation multiple times with different random seeds",
    category: "Modeling and Simulations"
  },
  {
    id: 978,
    question: "What is a confidence interval?",
    options: ["A guess", "A statistical range that estimates an unknown parameter with a certain confidence level", "A backup", "A lockfile"],
    answer: "A statistical range that estimates an unknown parameter with a certain confidence level",
    category: "Modeling and Simulations"
  },
  {
    id: 979,
    question: "What is an event list in DES?",
    options: ["A todo list", "A list of scheduled future events ordered by time", "A guest list", "An OS structure"],
    answer: "A list of scheduled future events ordered by time",
    category: "Modeling and Simulations"
  },
  {
    id: 980,
    question: "What is a system entity?",
    options: ["A user", "An object in the simulation that flows through the system (like a customer)", "A class file", "A protocol"],
    answer: "An object in the simulation that flows through the system (like a customer)",
    category: "Modeling and Simulations"
  },
  {
    id: 981,
    question: "What is an attribute of an entity?",
    options: ["A property describing it (e.g., arrival time)", "A class", "A loop", "A database"],
    answer: "A property describing it (e.g., arrival time)",
    category: "Modeling and Simulations"
  },
  {
    id: 982,
    question: "What is a resource in simulation?",
    options: ["A finite-capacity entity that serves entities (e.g., teller, machine)", "An empty value", "A file", "A protocol"],
    answer: "A finite-capacity entity that serves entities (e.g., teller, machine)",
    category: "Modeling and Simulations"
  },
  {
    id: 983,
    question: "What does FIFO mean in queues?",
    options: ["First-In, First-Out", "Fast Index For Output", "First-In Final Out", "Free In, First Out"],
    answer: "First-In, First-Out",
    category: "Modeling and Simulations"
  },
  {
    id: 984,
    question: "What does LIFO mean?",
    options: ["Last-In, First-Out", "Linear Input For Output", "Last Inverted For Order", "Logical In For Output"],
    answer: "Last-In, First-Out",
    category: "Modeling and Simulations"
  },
  {
    id: 985,
    question: "What is animation in simulation?",
    options: ["Cartoons only", "Visual representation of simulation dynamics over time", "Static drawings", "A backup"],
    answer: "Visual representation of simulation dynamics over time",
    category: "Modeling and Simulations"
  },
  {
    id: 986,
    question: "What does 'transient state' mean?",
    options: ["A short-lived state before reaching steady state", "Permanent state", "Idle state", "Steady state"],
    answer: "A short-lived state before reaching steady state",
    category: "Modeling and Simulations"
  },
  {
    id: 987,
    question: "What is a black-box model?",
    options: ["A literal black box", "A model where internal mechanisms are unknown; only inputs and outputs are observed", "A database table", "A drawing"],
    answer: "A model where internal mechanisms are unknown; only inputs and outputs are observed",
    category: "Modeling and Simulations"
  },
  {
    id: 988,
    question: "What is a white-box model?",
    options: ["A glass box", "A model where the internal workings are known and visible", "A black-box", "A backup"],
    answer: "A model where the internal workings are known and visible",
    category: "Modeling and Simulations"
  },
  {
    id: 989,
    question: "What is a state variable?",
    options: ["A constant", "A variable describing the current condition of the system at any time", "A backup variable", "A class type"],
    answer: "A variable describing the current condition of the system at any time",
    category: "Modeling and Simulations"
  },
  {
    id: 990,
    question: "What is throughput in simulation?",
    options: ["Idle time", "The rate at which entities are processed by the system", "Backup time", "Wait time only"],
    answer: "The rate at which entities are processed by the system",
    category: "Modeling and Simulations"
  },
  {
    id: 991,
    question: "What is utilization?",
    options: ["The fraction of time a resource is busy", "Idle time", "Compile time", "Backup ratio"],
    answer: "The fraction of time a resource is busy",
    category: "Modeling and Simulations"
  },
  {
    id: 992,
    question: "Which is NOT a simulation step?",
    options: ["Define problem", "Build model", "Eat lunch", "Validate model"],
    answer: "Eat lunch",
    category: "Modeling and Simulations"
  },
  {
    id: 993,
    question: "What is a what-if analysis?",
    options: ["Studying outcomes by changing input scenarios", "Encryption", "A backup", "Compilation"],
    answer: "Studying outcomes by changing input scenarios",
    category: "Modeling and Simulations"
  },
  {
    id: 994,
    question: "What is animation often used for in DES?",
    options: ["Communicating model behavior to stakeholders", "Encryption", "Compilation", "Backup"],
    answer: "Communicating model behavior to stakeholders",
    category: "Modeling and Simulations"
  },
  {
    id: 995,
    question: "What is calibration of a model?",
    options: ["Setting up a printer", "Adjusting parameters so model outputs match observed data", "A backup", "Encryption"],
    answer: "Adjusting parameters so model outputs match observed data",
    category: "Modeling and Simulations"
  },
  {
    id: 996,
    question: "Which is a hybrid simulation?",
    options: ["Combining discrete-event and continuous simulation", "Only continuous", "Only discrete", "No simulation"],
    answer: "Combining discrete-event and continuous simulation",
    category: "Modeling and Simulations"
  },
  {
    id: 997,
    question: "What does 'chi-square' test help with in simulation?",
    options: ["Goodness-of-fit testing for distributions", "Encryption", "Backup", "Compiling"],
    answer: "Goodness-of-fit testing for distributions",
    category: "Modeling and Simulations"
  },
  {
    id: 998,
    question: "What is a Markov chain?",
    options: ["A blockchain", "A stochastic process where the next state depends only on the current state", "A static drawing", "A SQL query"],
    answer: "A stochastic process where the next state depends only on the current state",
    category: "Modeling and Simulations"
  },
  {
    id: 999,
    question: "What is bottleneck analysis?",
    options: ["Studying glass bottles", "Identifying the slowest part of a system limiting throughput", "Database optimization", "Backup design"],
    answer: "Identifying the slowest part of a system limiting throughput",
    category: "Modeling and Simulations"
  },
  {
    id: 1000,
    question: "What is the goal of simulation output analysis?",
    options: ["Drawing pretty graphs", "Drawing valid statistical conclusions about the system from simulation results", "Backup", "Compilation"],
    answer: "Drawing valid statistical conclusions about the system from simulation results",
    category: "Modeling and Simulations"
  },
  {
    id: 1001,
    question: "What is a data warehouse?",
    options: ["A storage building", "A central repository for storing integrated data from multiple sources for analysis", "A web server", "A type of cache"],
    answer: "A central repository for storing integrated data from multiple sources for analysis",
    category: "Data Warehousing"
  },
  {
    id: 1002,
    question: "Who is credited as the father of data warehousing?",
    options: ["Linus Torvalds", "Bill Inmon", "Bill Gates", "Edgar Codd"],
    answer: "Bill Inmon",
    category: "Data Warehousing"
  },
  {
    id: 1003,
    question: "Which is a key characteristic of a data warehouse?",
    options: ["Volatile", "Subject-oriented, integrated, time-variant, non-volatile", "Real-time only", "Unstructured"],
    answer: "Subject-oriented, integrated, time-variant, non-volatile",
    category: "Data Warehousing"
  },
  {
    id: 1004,
    question: "What does ETL stand for?",
    options: ["Extract, Transform, Load", "Edit, Test, Launch", "Enter, Transfer, Logout", "Extract, Test, Load"],
    answer: "Extract, Transform, Load",
    category: "Data Warehousing"
  },
  {
    id: 1005,
    question: "Which is the FIRST step in ETL?",
    options: ["Load", "Extract", "Transform", "Test"],
    answer: "Extract",
    category: "Data Warehousing"
  },
  {
    id: 1006,
    question: "What is a data mart?",
    options: ["A grocery store", "A subset of a data warehouse focused on a specific business area", "A database backup", "A query"],
    answer: "A subset of a data warehouse focused on a specific business area",
    category: "Data Warehousing"
  },
  {
    id: 1007,
    question: "What is a fact table?",
    options: ["A table of true statements", "Central table in a star schema containing measurable, quantitative data", "A backup table", "A constant table"],
    answer: "Central table in a star schema containing measurable, quantitative data",
    category: "Data Warehousing"
  },
  {
    id: 1008,
    question: "What is a dimension table?",
    options: ["A 3D table", "A table containing descriptive attributes related to facts", "A backup", "A view"],
    answer: "A table containing descriptive attributes related to facts",
    category: "Data Warehousing"
  },
  {
    id: 1009,
    question: "Which schema has a central fact table connected to dimension tables?",
    options: ["Star schema", "Round schema", "Square schema", "Tree schema"],
    answer: "Star schema",
    category: "Data Warehousing"
  },
  {
    id: 1010,
    question: "What is a snowflake schema?",
    options: ["A weather schema", "A normalized form of star schema where dimension tables are split into related tables", "A type of fact table", "A view"],
    answer: "A normalized form of star schema where dimension tables are split into related tables",
    category: "Data Warehousing"
  },
  {
    id: 1011,
    question: "What is OLAP?",
    options: ["Online Analytical Processing — for complex analytical queries", "Online Application Process", "Open Learning Access Program", "Offline Audit Logging Process"],
    answer: "Online Analytical Processing — for complex analytical queries",
    category: "Data Warehousing"
  },
  {
    id: 1012,
    question: "What is OLTP?",
    options: ["Online Transaction Processing — for short, frequent transactions", "Online Test Plan", "Online Trading Platform", "Open Logic Transfer Protocol"],
    answer: "Online Transaction Processing — for short, frequent transactions",
    category: "Data Warehousing"
  },
  {
    id: 1013,
    question: "Which is true about OLAP vs OLTP?",
    options: ["OLAP is for analysis; OLTP is for daily operations", "OLAP is for transactions", "OLTP is for analysis", "Same purpose"],
    answer: "OLAP is for analysis; OLTP is for daily operations",
    category: "Data Warehousing"
  },
  {
    id: 1014,
    question: "What is a data cube?",
    options: ["A physical cube", "A multi-dimensional array of values used in OLAP", "A 2D table", "A backup file"],
    answer: "A multi-dimensional array of values used in OLAP",
    category: "Data Warehousing"
  },
  {
    id: 1015,
    question: "What is slicing in OLAP?",
    options: ["Cutting a meal", "Selecting a single layer of the data cube along one dimension", "Backing up", "A query type"],
    answer: "Selecting a single layer of the data cube along one dimension",
    category: "Data Warehousing"
  },
  {
    id: 1016,
    question: "What is dicing in OLAP?",
    options: ["Game of dice", "Producing a sub-cube by selecting two or more dimensions", "A backup", "Dropping data"],
    answer: "Producing a sub-cube by selecting two or more dimensions",
    category: "Data Warehousing"
  },
  {
    id: 1017,
    question: "What is roll-up in OLAP?",
    options: ["Aggregating data by climbing up a hierarchy (e.g., daily → monthly)", "Going down a hierarchy", "A type of backup", "Sorting"],
    answer: "Aggregating data by climbing up a hierarchy (e.g., daily → monthly)",
    category: "Data Warehousing"
  },
  {
    id: 1018,
    question: "What is drill-down in OLAP?",
    options: ["Aggregating up", "Navigating from less detail to more detail in a hierarchy", "A type of join", "Backup"],
    answer: "Navigating from less detail to more detail in a hierarchy",
    category: "Data Warehousing"
  },
  {
    id: 1019,
    question: "What is pivoting in OLAP?",
    options: ["Rotating the data cube to view it from different perspectives", "A backup operation", "An index", "Compiling"],
    answer: "Rotating the data cube to view it from different perspectives",
    category: "Data Warehousing"
  },
  {
    id: 1020,
    question: "Which is a popular ETL tool?",
    options: ["Informatica", "Outlook", "Word", "Photoshop"],
    answer: "Informatica",
    category: "Data Warehousing"
  },
  {
    id: 1021,
    question: "What is a data lake?",
    options: ["A natural lake", "A storage repository holding raw, unstructured/structured data at any scale", "A small DB", "A backup"],
    answer: "A storage repository holding raw, unstructured/structured data at any scale",
    category: "Data Warehousing"
  },
  {
    id: 1022,
    question: "Which is a difference between data lake and data warehouse?",
    options: ["Data lake stores raw data; warehouse stores processed/structured data", "They are the same", "Lake is for OLTP", "Warehouse holds raw data"],
    answer: "Data lake stores raw data; warehouse stores processed/structured data",
    category: "Data Warehousing"
  },
  {
    id: 1023,
    question: "What is metadata?",
    options: ["Data about data", "Data only", "Empty data", "Encrypted data"],
    answer: "Data about data",
    category: "Data Warehousing"
  },
  {
    id: 1024,
    question: "What is a slowly changing dimension (SCD)?",
    options: ["A dimension where attributes change slowly over time", "A fast index", "A static fact table", "A query"],
    answer: "A dimension where attributes change slowly over time",
    category: "Data Warehousing"
  },
  {
    id: 1025,
    question: "Which SCD type overwrites old values?",
    options: ["Type 1", "Type 2", "Type 3", "Type 4"],
    answer: "Type 1",
    category: "Data Warehousing"
  },
  {
    id: 1026,
    question: "Which SCD type creates a new record for each change (full history)?",
    options: ["Type 1", "Type 2", "Type 3", "Type 0"],
    answer: "Type 2",
    category: "Data Warehousing"
  },
  {
    id: 1027,
    question: "What is data integration?",
    options: ["Combining data from different sources into a unified view", "Encrypting data", "Compressing", "Backing up"],
    answer: "Combining data from different sources into a unified view",
    category: "Data Warehousing"
  },
  {
    id: 1028,
    question: "What is a staging area?",
    options: ["A theater stage", "An intermediate area where ETL transformations happen before loading", "A backup location only", "A user table"],
    answer: "An intermediate area where ETL transformations happen before loading",
    category: "Data Warehousing"
  },
  {
    id: 1029,
    question: "What is data cleansing?",
    options: ["Deleting all data", "Detecting and correcting/removing inaccurate or corrupt records", "Encryption", "Backup"],
    answer: "Detecting and correcting/removing inaccurate or corrupt records",
    category: "Data Warehousing"
  },
  {
    id: 1030,
    question: "What is an aggregate in data warehouse?",
    options: ["A summarized value (sum, average, count) over a group", "Raw data", "A backup", "An index"],
    answer: "A summarized value (sum, average, count) over a group",
    category: "Data Warehousing"
  },
  {
    id: 1031,
    question: "Which is a data warehouse architecture style?",
    options: ["Inmon (top-down) or Kimball (bottom-up)", "Photoshop", "Excel only", "JSON"],
    answer: "Inmon (top-down) or Kimball (bottom-up)",
    category: "Data Warehousing"
  },
  {
    id: 1032,
    question: "Who is associated with the dimensional modeling approach?",
    options: ["Bill Inmon", "Ralph Kimball", "Edgar Codd", "Charles Babbage"],
    answer: "Ralph Kimball",
    category: "Data Warehousing"
  },
  {
    id: 1033,
    question: "What does CDC stand for in DW?",
    options: ["Change Data Capture", "Central Data Center", "Customer Data Cache", "Computer Data Cycle"],
    answer: "Change Data Capture",
    category: "Data Warehousing"
  },
  {
    id: 1034,
    question: "What is a surrogate key?",
    options: ["A natural business key", "An artificially generated unique identifier in dimension tables", "A foreign key", "A trigger"],
    answer: "An artificially generated unique identifier in dimension tables",
    category: "Data Warehousing"
  },
  {
    id: 1035,
    question: "What is grain in fact tables?",
    options: ["Cereal", "The level of detail at which facts are stored", "A schema type", "A query type"],
    answer: "The level of detail at which facts are stored",
    category: "Data Warehousing"
  },
  {
    id: 1036,
    question: "Which is a popular cloud data warehouse?",
    options: ["Snowflake", "Photoshop", "Word", "Outlook"],
    answer: "Snowflake",
    category: "Data Warehousing"
  },
  {
    id: 1037,
    question: "Which AWS service is a managed data warehouse?",
    options: ["Redshift", "EC2", "S3", "Lambda"],
    answer: "Redshift",
    category: "Data Warehousing"
  },
  {
    id: 1038,
    question: "Which Google Cloud service is a managed data warehouse?",
    options: ["BigQuery", "Drive", "Maps", "Photos"],
    answer: "BigQuery",
    category: "Data Warehousing"
  },
  {
    id: 1039,
    question: "Which Microsoft Azure service is a managed data warehouse?",
    options: ["Synapse Analytics", "Outlook", "Word", "Excel"],
    answer: "Synapse Analytics",
    category: "Data Warehousing"
  },
  {
    id: 1040,
    question: "What is denormalization in DW?",
    options: ["Adding redundancy intentionally to improve read performance", "Removing data", "Encrypting", "Backing up"],
    answer: "Adding redundancy intentionally to improve read performance",
    category: "Data Warehousing"
  },
  {
    id: 1041,
    question: "Which type of query is typical in OLAP?",
    options: ["INSERT", "UPDATE", "Complex SELECT with aggregation", "DELETE"],
    answer: "Complex SELECT with aggregation",
    category: "Data Warehousing"
  },
  {
    id: 1042,
    question: "What is bus architecture in DW?",
    options: ["A vehicle", "Kimball's approach where conformed dimensions are shared across data marts", "A type of cable", "A protocol"],
    answer: "Kimball's approach where conformed dimensions are shared across data marts",
    category: "Data Warehousing"
  },
  {
    id: 1043,
    question: "What is a conformed dimension?",
    options: ["A dimension shared and consistent across multiple fact tables/data marts", "A unique dimension", "A backup", "A view"],
    answer: "A dimension shared and consistent across multiple fact tables/data marts",
    category: "Data Warehousing"
  },
  {
    id: 1044,
    question: "What is data profiling?",
    options: ["Watching profiles", "Examining data to understand its structure, quality, and content", "Encryption", "Compilation"],
    answer: "Examining data to understand its structure, quality, and content",
    category: "Data Warehousing"
  },
  {
    id: 1045,
    question: "What is master data?",
    options: ["Big data", "Critical business data shared across systems (customers, products)", "Backup data", "A view"],
    answer: "Critical business data shared across systems (customers, products)",
    category: "Data Warehousing"
  },
  {
    id: 1046,
    question: "What does MDM stand for?",
    options: ["Master Data Management", "Multi Database Module", "Memory Data Mode", "Massive Data Model"],
    answer: "Master Data Management",
    category: "Data Warehousing"
  },
  {
    id: 1047,
    question: "What is a junk dimension?",
    options: ["Bad data", "A dimension that combines low-cardinality flags/indicators into one table", "A backup", "An index"],
    answer: "A dimension that combines low-cardinality flags/indicators into one table",
    category: "Data Warehousing"
  },
  {
    id: 1048,
    question: "What is a degenerate dimension?",
    options: ["A degraded dimension", "A dimension key (e.g., invoice number) stored in the fact table without a separate dimension table", "A backup", "A view"],
    answer: "A dimension key (e.g., invoice number) stored in the fact table without a separate dimension table",
    category: "Data Warehousing"
  },
  {
    id: 1049,
    question: "Which is a benefit of a data warehouse?",
    options: ["Better business decisions through historical analysis", "Slower reports", "More data redundancy across systems", "Real-time OLTP"],
    answer: "Better business decisions through historical analysis",
    category: "Data Warehousing"
  },
  {
    id: 1050,
    question: "Which language is commonly used for OLAP queries?",
    options: ["MDX (Multidimensional Expressions)", "HTML", "CSS", "JSON"],
    answer: "MDX (Multidimensional Expressions)",
    category: "Data Warehousing"
  },
  {
    id: 1051,
    question: "What is data mining?",
    options: ["Drilling for data", "Discovering patterns and useful information from large datasets", "Backing up data", "Encrypting data"],
    answer: "Discovering patterns and useful information from large datasets",
    category: "Data Mining"
  },
  {
    id: 1052,
    question: "Which is a data mining task?",
    options: ["Classification", "Compilation", "Encryption", "Backup"],
    answer: "Classification",
    category: "Data Mining"
  },
  {
    id: 1053,
    question: "What is classification?",
    options: ["Sorting clothes", "Predicting categorical labels for new instances", "Backing up", "Encrypting"],
    answer: "Predicting categorical labels for new instances",
    category: "Data Mining"
  },
  {
    id: 1054,
    question: "Which is a classification algorithm?",
    options: ["Decision Tree", "K-Means", "Apriori", "FP-Growth"],
    answer: "Decision Tree",
    category: "Data Mining"
  },
  {
    id: 1055,
    question: "What is clustering?",
    options: ["Sorting groups", "Grouping similar records together without predefined labels", "Encryption", "Compression"],
    answer: "Grouping similar records together without predefined labels",
    category: "Data Mining"
  },
  {
    id: 1056,
    question: "Which is a clustering algorithm?",
    options: ["K-Means", "Decision Tree", "Naive Bayes", "Apriori"],
    answer: "K-Means",
    category: "Data Mining"
  },
  {
    id: 1057,
    question: "What is association rule mining?",
    options: ["Finding rules describing relationships between items in transactions", "Encryption", "Backup", "A schema design"],
    answer: "Finding rules describing relationships between items in transactions",
    category: "Data Mining"
  },
  {
    id: 1058,
    question: "Which is the classic association rule algorithm?",
    options: ["Apriori", "K-Means", "Linear Regression", "Decision Tree"],
    answer: "Apriori",
    category: "Data Mining"
  },
  {
    id: 1059,
    question: "What does 'support' mean in association rules?",
    options: ["Customer service", "Frequency of itemset in dataset", "Confidence", "Lift"],
    answer: "Frequency of itemset in dataset",
    category: "Data Mining"
  },
  {
    id: 1060,
    question: "What does 'confidence' mean?",
    options: ["Trust", "P(B|A) — likelihood of B given A", "Support", "Lift"],
    answer: "P(B|A) — likelihood of B given A",
    category: "Data Mining"
  },
  {
    id: 1061,
    question: "What does 'lift' measure?",
    options: ["Encryption strength", "How much more likely B is given A vs. by chance", "Support", "Confidence"],
    answer: "How much more likely B is given A vs. by chance",
    category: "Data Mining"
  },
  {
    id: 1062,
    question: "What is supervised learning?",
    options: ["Learning without labels", "Learning from labeled training data", "Random sampling", "Clustering"],
    answer: "Learning from labeled training data",
    category: "Data Mining"
  },
  {
    id: 1063,
    question: "What is unsupervised learning?",
    options: ["Learning from labeled data", "Learning patterns from unlabeled data", "Reinforcement", "Compilation"],
    answer: "Learning patterns from unlabeled data",
    category: "Data Mining"
  },
  {
    id: 1064,
    question: "Which is an example of unsupervised learning?",
    options: ["Clustering", "Linear regression", "Logistic regression", "Decision tree"],
    answer: "Clustering",
    category: "Data Mining"
  },
  {
    id: 1065,
    question: "What is regression?",
    options: ["Going backwards", "Predicting continuous numerical values", "Classification", "Clustering"],
    answer: "Predicting continuous numerical values",
    category: "Data Mining"
  },
  {
    id: 1066,
    question: "What is overfitting?",
    options: ["Underperforming on training data", "Model fits training data too closely and fails to generalize", "Perfect generalization", "Cleaning data"],
    answer: "Model fits training data too closely and fails to generalize",
    category: "Data Mining"
  },
  {
    id: 1067,
    question: "What is underfitting?",
    options: ["Model is too simple to capture the underlying patterns", "Overfit", "Perfect fit", "Clean data"],
    answer: "Model is too simple to capture the underlying patterns",
    category: "Data Mining"
  },
  {
    id: 1068,
    question: "What is data preprocessing?",
    options: ["Final stage", "Cleaning and transforming raw data into a usable form", "Encrypting", "Backing up"],
    answer: "Cleaning and transforming raw data into a usable form",
    category: "Data Mining"
  },
  {
    id: 1069,
    question: "What is feature selection?",
    options: ["Picking colors", "Choosing the most relevant input variables for a model", "Encrypting", "Backup"],
    answer: "Choosing the most relevant input variables for a model",
    category: "Data Mining"
  },
  {
    id: 1070,
    question: "What is a confusion matrix?",
    options: ["A confusing matrix", "A table showing TP/TN/FP/FN to evaluate classification performance", "A schema", "A backup"],
    answer: "A table showing TP/TN/FP/FN to evaluate classification performance",
    category: "Data Mining"
  },
  {
    id: 1071,
    question: "What is precision?",
    options: ["TP / (TP + FP)", "TP / (TP + FN)", "TN / (TN + FP)", "Random metric"],
    answer: "TP / (TP + FP)",
    category: "Data Mining"
  },
  {
    id: 1072,
    question: "What is recall?",
    options: ["TP / (TP + FP)", "TP / (TP + FN)", "TN / (TN + FN)", "Backup metric"],
    answer: "TP / (TP + FN)",
    category: "Data Mining"
  },
  {
    id: 1073,
    question: "What is the F1 score?",
    options: ["A racing measure", "Harmonic mean of precision and recall", "Average accuracy", "Sum of TP and TN"],
    answer: "Harmonic mean of precision and recall",
    category: "Data Mining"
  },
  {
    id: 1074,
    question: "What is accuracy?",
    options: ["TP / (TP + FP)", "(TP + TN) / Total", "TP / (TP + FN)", "FP only"],
    answer: "(TP + TN) / Total",
    category: "Data Mining"
  },
  {
    id: 1075,
    question: "What is a decision tree?",
    options: ["A real tree", "A model that splits data based on feature values to make decisions", "A clustering technique", "A backup"],
    answer: "A model that splits data based on feature values to make decisions",
    category: "Data Mining"
  },
  {
    id: 1076,
    question: "What is entropy in decision trees?",
    options: ["A backup", "A measure of impurity / information content", "A type of node", "A leaf only"],
    answer: "A measure of impurity / information content",
    category: "Data Mining"
  },
  {
    id: 1077,
    question: "What is information gain?",
    options: ["Gaining size", "Reduction in entropy after splitting on a feature", "Encryption strength", "A loss measure"],
    answer: "Reduction in entropy after splitting on a feature",
    category: "Data Mining"
  },
  {
    id: 1078,
    question: "Which algorithm is used for decision trees?",
    options: ["ID3, C4.5, CART", "Apriori", "K-Means", "DBSCAN"],
    answer: "ID3, C4.5, CART",
    category: "Data Mining"
  },
  {
    id: 1079,
    question: "What is K-Means clustering?",
    options: ["Classification", "Partitioning data into K clusters around centroids", "Association", "Regression"],
    answer: "Partitioning data into K clusters around centroids",
    category: "Data Mining"
  },
  {
    id: 1080,
    question: "What is hierarchical clustering?",
    options: ["A flat structure", "Building a tree of nested clusters", "K-Means only", "DBSCAN only"],
    answer: "Building a tree of nested clusters",
    category: "Data Mining"
  },
  {
    id: 1081,
    question: "Which clustering uses density of points?",
    options: ["K-Means", "DBSCAN", "Hierarchical", "Apriori"],
    answer: "DBSCAN",
    category: "Data Mining"
  },
  {
    id: 1082,
    question: "What is Naive Bayes?",
    options: ["A clustering technique", "A probabilistic classifier based on Bayes' theorem", "A decision tree", "A regression"],
    answer: "A probabilistic classifier based on Bayes' theorem",
    category: "Data Mining"
  },
  {
    id: 1083,
    question: "What is a neural network?",
    options: ["A network of computers", "A model inspired by biological neurons that learns through layered nodes", "A decision tree", "A backup"],
    answer: "A model inspired by biological neurons that learns through layered nodes",
    category: "Data Mining"
  },
  {
    id: 1084,
    question: "What is k-Nearest Neighbors (k-NN)?",
    options: ["A clustering technique", "A classifier predicting based on majority class of nearest neighbors", "An association rule", "A regression"],
    answer: "A classifier predicting based on majority class of nearest neighbors",
    category: "Data Mining"
  },
  {
    id: 1085,
    question: "What is cross-validation?",
    options: ["Cross-checking", "Splitting data into folds to estimate model generalization performance", "A backup type", "Encryption"],
    answer: "Splitting data into folds to estimate model generalization performance",
    category: "Data Mining"
  },
  {
    id: 1086,
    question: "What is bootstrapping in statistics?",
    options: ["A reboot", "Sampling with replacement to estimate metrics or build models", "Encryption", "Backup"],
    answer: "Sampling with replacement to estimate metrics or build models",
    category: "Data Mining"
  },
  {
    id: 1087,
    question: "What is a Random Forest?",
    options: ["A real forest", "An ensemble of decision trees that votes on the prediction", "A clustering algorithm", "A backup"],
    answer: "An ensemble of decision trees that votes on the prediction",
    category: "Data Mining"
  },
  {
    id: 1088,
    question: "What is gradient boosting?",
    options: ["Battery boosting", "Sequentially building models that correct previous errors", "A linear regression", "A clustering"],
    answer: "Sequentially building models that correct previous errors",
    category: "Data Mining"
  },
  {
    id: 1089,
    question: "What is text mining?",
    options: ["Drilling text", "Extracting useful information from textual data", "Encryption", "Compression"],
    answer: "Extracting useful information from textual data",
    category: "Data Mining"
  },
  {
    id: 1090,
    question: "What is web mining?",
    options: ["Mining cryptocurrency", "Discovering patterns from web data and usage", "Encryption", "Backup"],
    answer: "Discovering patterns from web data and usage",
    category: "Data Mining"
  },
  {
    id: 1091,
    question: "Which is a data mining application?",
    options: ["Market basket analysis", "Compiling code", "Backups only", "OS scheduling"],
    answer: "Market basket analysis",
    category: "Data Mining"
  },
  {
    id: 1092,
    question: "What is sentiment analysis?",
    options: ["Emotional therapy", "Determining the opinion or feeling expressed in text", "Encryption", "A backup"],
    answer: "Determining the opinion or feeling expressed in text",
    category: "Data Mining"
  },
  {
    id: 1093,
    question: "What is anomaly detection?",
    options: ["Identifying rare or unusual observations", "Encryption", "Backup", "Compilation"],
    answer: "Identifying rare or unusual observations",
    category: "Data Mining"
  },
  {
    id: 1094,
    question: "Which is a step in the CRISP-DM process?",
    options: ["Business Understanding", "Compilation", "Encryption", "Networking"],
    answer: "Business Understanding",
    category: "Data Mining"
  },
  {
    id: 1095,
    question: "What does CRISP-DM stand for?",
    options: ["Cross Industry Standard Process for Data Mining", "Custom Research in Statistical Process for Data Models", "Critical Information Standard Plan for Data Mining", "Cross Indexed Standard Plan for Data Modeling"],
    answer: "Cross Industry Standard Process for Data Mining",
    category: "Data Mining"
  },
  {
    id: 1096,
    question: "Which library is widely used in Python for data mining/ML?",
    options: ["scikit-learn", "Outlook", "Photoshop", "Excel only"],
    answer: "scikit-learn",
    category: "Data Mining"
  },
  {
    id: 1097,
    question: "What is dimensionality reduction?",
    options: ["Reducing the number of features while preserving information", "Encryption", "Backup", "Compilation"],
    answer: "Reducing the number of features while preserving information",
    category: "Data Mining"
  },
  {
    id: 1098,
    question: "Which is a dimensionality reduction technique?",
    options: ["PCA", "K-Means", "Apriori", "FP-Growth"],
    answer: "PCA",
    category: "Data Mining"
  },
  {
    id: 1099,
    question: "What does PCA stand for?",
    options: ["Principal Component Analysis", "Personal Computer Algorithm", "Predictive Coverage Algorithm", "Process Cluster Average"],
    answer: "Principal Component Analysis",
    category: "Data Mining"
  },
  {
    id: 1100,
    question: "What is the goal of data mining?",
    options: ["Backup", "Discover useful, actionable patterns in large data", "Encryption only", "Compilation"],
    answer: "Discover useful, actionable patterns in large data",
    category: "Data Mining"
  },
  {
    id: 1101,
    question: "What is project management?",
    options: ["Random task doing", "Application of knowledge, skills, tools to project activities to meet requirements", "Coding", "Marketing only"],
    answer: "Application of knowledge, skills, tools to project activities to meet requirements",
    category: "IT Project Management"
  },
  {
    id: 1102,
    question: "What are the triple constraints of a project?",
    options: ["Scope, Time, Cost", "Speed, Quality, Cost", "Time, Code, Quality", "Coffee, Tea, Sleep"],
    answer: "Scope, Time, Cost",
    category: "IT Project Management"
  },
  {
    id: 1103,
    question: "Who is the project manager?",
    options: ["The boss of the company", "The person responsible for leading the project to meet objectives", "A programmer", "A user"],
    answer: "The person responsible for leading the project to meet objectives",
    category: "IT Project Management"
  },
  {
    id: 1104,
    question: "Which document defines what is and isn't included in a project?",
    options: ["Scope statement", "Bill of materials", "Budget log", "Database schema"],
    answer: "Scope statement",
    category: "IT Project Management"
  },
  {
    id: 1105,
    question: "What is a WBS?",
    options: ["Work Breakdown Structure — hierarchical decomposition of work", "Web-Based Server", "Wireless Broadband Service", "Workflow Backup System"],
    answer: "Work Breakdown Structure — hierarchical decomposition of work",
    category: "IT Project Management"
  },
  {
    id: 1106,
    question: "What is a milestone?",
    options: ["A stone for hiking", "A significant point or event in a project", "A bug", "A user role"],
    answer: "A significant point or event in a project",
    category: "IT Project Management"
  },
  {
    id: 1107,
    question: "What is a Gantt chart?",
    options: ["A bar chart showing tasks vs. time", "A pie chart", "A flowchart only", "An ER diagram"],
    answer: "A bar chart showing tasks vs. time",
    category: "IT Project Management"
  },
  {
    id: 1108,
    question: "What is the critical path?",
    options: ["The shortest path", "The longest path through the project, determining minimum duration", "An optional task", "A milestone"],
    answer: "The longest path through the project, determining minimum duration",
    category: "IT Project Management"
  },
  {
    id: 1109,
    question: "What does CPM stand for?",
    options: ["Critical Path Method", "Cost Per Mile", "Cycle Per Minute", "Code Per Module"],
    answer: "Critical Path Method",
    category: "IT Project Management"
  },
  {
    id: 1110,
    question: "What does PERT stand for?",
    options: ["Program Evaluation and Review Technique", "Project Execution Routing Tool", "Process Estimation Real Time", "Performance Evaluation Reactor Time"],
    answer: "Program Evaluation and Review Technique",
    category: "IT Project Management"
  },
  {
    id: 1111,
    question: "Which is NOT a phase in PMBOK process groups?",
    options: ["Initiating", "Planning", "Cooking", "Closing"],
    answer: "Cooking",
    category: "IT Project Management"
  },
  {
    id: 1112,
    question: "What does PMBOK stand for?",
    options: ["Project Management Body of Knowledge", "Public Management Block Of Knowledge", "Project Managed Business of Operations Kit", "Productive Management Boost Of Knowledge"],
    answer: "Project Management Body of Knowledge",
    category: "IT Project Management"
  },
  {
    id: 1113,
    question: "What is the role of a stakeholder?",
    options: ["Someone with interest in or affected by the project", "Only the developer", "Only the customer", "An external vendor only"],
    answer: "Someone with interest in or affected by the project",
    category: "IT Project Management"
  },
  {
    id: 1114,
    question: "Which is a project initiation document?",
    options: ["Project Charter", "Source code", "Test cases", "Class diagram"],
    answer: "Project Charter",
    category: "IT Project Management"
  },
  {
    id: 1115,
    question: "What is risk management?",
    options: ["Avoiding all action", "Identifying, assessing, and responding to project risks", "Coding only", "Marketing"],
    answer: "Identifying, assessing, and responding to project risks",
    category: "IT Project Management"
  },
  {
    id: 1116,
    question: "Which is a risk response strategy?",
    options: ["Mitigate", "Compile", "Encrypt", "Backup"],
    answer: "Mitigate",
    category: "IT Project Management"
  },
  {
    id: 1117,
    question: "What is scope creep?",
    options: ["Reduction in scope", "Uncontrolled expansion of scope without time/cost adjustments", "Stable scope", "A user role"],
    answer: "Uncontrolled expansion of scope without time/cost adjustments",
    category: "IT Project Management"
  },
  {
    id: 1118,
    question: "What is earned value (EV)?",
    options: ["Money owed", "Value of work actually performed at a point in time", "Budget", "Profit"],
    answer: "Value of work actually performed at a point in time",
    category: "IT Project Management"
  },
  {
    id: 1119,
    question: "What is SPI?",
    options: ["Schedule Performance Index = EV/PV", "Speed Per Interval", "Standard Performance Index = AC/PV", "Static Performance Index"],
    answer: "Schedule Performance Index = EV/PV",
    category: "IT Project Management"
  },
  {
    id: 1120,
    question: "What is CPI?",
    options: ["Cost Performance Index = EV/AC", "Cycle Per Interval", "Code Per Iteration", "Cost Plus Index"],
    answer: "Cost Performance Index = EV/AC",
    category: "IT Project Management"
  },
  {
    id: 1121,
    question: "Which is an Agile methodology?",
    options: ["Waterfall", "Scrum", "Big-Bang", "V-model"],
    answer: "Scrum",
    category: "IT Project Management"
  },
  {
    id: 1122,
    question: "Who facilitates the Scrum process?",
    options: ["Project Manager", "Scrum Master", "CEO", "Product Owner"],
    answer: "Scrum Master",
    category: "IT Project Management"
  },
  {
    id: 1123,
    question: "Who prioritizes the product backlog in Scrum?",
    options: ["Scrum Master", "Product Owner", "Developers only", "QA"],
    answer: "Product Owner",
    category: "IT Project Management"
  },
  {
    id: 1124,
    question: "What is a sprint typically?",
    options: ["A 2-4 week iteration of work", "A whole project", "An hour-long meeting", "A test phase"],
    answer: "A 2-4 week iteration of work",
    category: "IT Project Management"
  },
  {
    id: 1125,
    question: "What is a daily stand-up?",
    options: ["A short daily meeting in Scrum to align team", "A weekly review", "A retrospective", "A demo"],
    answer: "A short daily meeting in Scrum to align team",
    category: "IT Project Management"
  },
  {
    id: 1126,
    question: "What is a retrospective?",
    options: ["A meeting at the end of a sprint to reflect and improve", "A planning meeting", "A vendor meeting", "A status call"],
    answer: "A meeting at the end of a sprint to reflect and improve",
    category: "IT Project Management"
  },
  {
    id: 1127,
    question: "Which is a project management tool?",
    options: ["MS Project / Jira / Trello", "Photoshop", "Outlook", "Word only"],
    answer: "MS Project / Jira / Trello",
    category: "IT Project Management"
  },
  {
    id: 1128,
    question: "What is a SOW?",
    options: ["Statement of Work — describes work to be done", "Sound Of Wave", "System of Work", "Statement of Wages"],
    answer: "Statement of Work — describes work to be done",
    category: "IT Project Management"
  },
  {
    id: 1129,
    question: "What is a kickoff meeting?",
    options: ["First meeting at the start of a project to align stakeholders", "A retrospective", "A demo", "Final meeting"],
    answer: "First meeting at the start of a project to align stakeholders",
    category: "IT Project Management"
  },
  {
    id: 1130,
    question: "What is project closure?",
    options: ["Failing the project", "Formally ending the project — finalizing deliverables, documents, and lessons", "Mid-project review", "Risk identification"],
    answer: "Formally ending the project — finalizing deliverables, documents, and lessons",
    category: "IT Project Management"
  },
  {
    id: 1131,
    question: "What is a deliverable?",
    options: ["A pizza", "Any unique product, service, or result produced as part of the project", "A budget", "A risk"],
    answer: "Any unique product, service, or result produced as part of the project",
    category: "IT Project Management"
  },
  {
    id: 1132,
    question: "What is a baseline?",
    options: ["A baseline drawing", "Approved version of a plan against which performance is measured", "A bug", "A milestone"],
    answer: "Approved version of a plan against which performance is measured",
    category: "IT Project Management"
  },
  {
    id: 1133,
    question: "What is change control?",
    options: ["Refusing all changes", "A formal process for managing changes to project scope/baselines", "Coding", "QA testing"],
    answer: "A formal process for managing changes to project scope/baselines",
    category: "IT Project Management"
  },
  {
    id: 1134,
    question: "What is quality assurance?",
    options: ["Process focused on preventing defects in deliverables", "Coding only", "Vendor management", "Backups"],
    answer: "Process focused on preventing defects in deliverables",
    category: "IT Project Management"
  },
  {
    id: 1135,
    question: "What is quality control?",
    options: ["Inspecting deliverables to ensure they meet requirements", "Marketing", "Salary review", "Hiring"],
    answer: "Inspecting deliverables to ensure they meet requirements",
    category: "IT Project Management"
  },
  {
    id: 1136,
    question: "What is a RACI matrix used for?",
    options: ["Tracking responsibility — Responsible, Accountable, Consulted, Informed", "Calculating risks", "Compiling code", "Forming clusters"],
    answer: "Tracking responsibility — Responsible, Accountable, Consulted, Informed",
    category: "IT Project Management"
  },
  {
    id: 1137,
    question: "What is a SWOT analysis?",
    options: ["Strengths, Weaknesses, Opportunities, Threats", "A budget tool", "A code review", "A network test"],
    answer: "Strengths, Weaknesses, Opportunities, Threats",
    category: "IT Project Management"
  },
  {
    id: 1138,
    question: "What is procurement management?",
    options: ["Managing acquisition of goods/services from outside the project team", "QA testing", "Risk identification", "Coding"],
    answer: "Managing acquisition of goods/services from outside the project team",
    category: "IT Project Management"
  },
  {
    id: 1139,
    question: "What is a risk register?",
    options: ["A document logging risks, their analysis, and responses", "A backup", "A stakeholder list", "A bug tracker"],
    answer: "A document logging risks, their analysis, and responses",
    category: "IT Project Management"
  },
  {
    id: 1140,
    question: "Which is a fixed-price contract characteristic?",
    options: ["Buyer assumes price risk", "Seller assumes price risk for fixed total cost", "No deliverables", "Hourly billing"],
    answer: "Seller assumes price risk for fixed total cost",
    category: "IT Project Management"
  },
  {
    id: 1141,
    question: "What is time and materials (T&M) contract?",
    options: ["Fixed price", "Buyer pays for time spent and materials used", "No payment", "Profit-share only"],
    answer: "Buyer pays for time spent and materials used",
    category: "IT Project Management"
  },
  {
    id: 1142,
    question: "What is a 'hammock task'?",
    options: ["A nap", "A summary task that spans multiple subtasks", "A vacation day", "A bug"],
    answer: "A summary task that spans multiple subtasks",
    category: "IT Project Management"
  },
  {
    id: 1143,
    question: "What is float (or slack) in scheduling?",
    options: ["Free coffee time", "The amount of time a task can be delayed without impacting project end date", "A type of task", "A milestone"],
    answer: "The amount of time a task can be delayed without impacting project end date",
    category: "IT Project Management"
  },
  {
    id: 1144,
    question: "What is fast tracking?",
    options: ["Hiring quickly", "Performing activities in parallel that were planned sequentially", "Skipping tasks", "Backup compression"],
    answer: "Performing activities in parallel that were planned sequentially",
    category: "IT Project Management"
  },
  {
    id: 1145,
    question: "What is crashing the schedule?",
    options: ["Crashing the system", "Adding resources to shorten project duration (often increases cost)", "Skipping tasks", "Cancelling the project"],
    answer: "Adding resources to shorten project duration (often increases cost)",
    category: "IT Project Management"
  },
  {
    id: 1146,
    question: "What is a project portfolio?",
    options: ["A photo album", "A collection of projects/programs managed together to meet strategic objectives", "A single project", "A backup"],
    answer: "A collection of projects/programs managed together to meet strategic objectives",
    category: "IT Project Management"
  },
  {
    id: 1147,
    question: "What is PMO?",
    options: ["Project Management Office — supports/governs projects in an organization", "Public Money Order", "Private Marketing Officer", "Project Money Office"],
    answer: "Project Management Office — supports/governs projects in an organization",
    category: "IT Project Management"
  },
  {
    id: 1148,
    question: "What does 'lessons learned' refer to?",
    options: ["School lessons", "Knowledge gained during a project, documented for future use", "A bug list", "A budget"],
    answer: "Knowledge gained during a project, documented for future use",
    category: "IT Project Management"
  },
  {
    id: 1149,
    question: "Which leadership style is typically best for emergencies?",
    options: ["Laissez-faire", "Autocratic / directive", "Democratic only", "Servant"],
    answer: "Autocratic / directive",
    category: "IT Project Management"
  },
  {
    id: 1150,
    question: "What is Tuckman's model of team development?",
    options: ["Forming, Storming, Norming, Performing, Adjourning", "Planning, Coding, Testing", "Initiation, Execution, Closure", "Risk, Cost, Scope"],
    answer: "Forming, Storming, Norming, Performing, Adjourning",
    category: "IT Project Management"
  },
  {
    id: 1151,
    question: "What is Operations Research (OR)?",
    options: ["Hospital surgery", "A discipline using analytical methods to make better decisions", "Database design", "Marketing"],
    answer: "A discipline using analytical methods to make better decisions",
    category: "Operation Research"
  },
  {
    id: 1152,
    question: "Linear programming (LP) is used for:",
    options: ["Coding only", "Optimizing a linear objective function under linear constraints", "Database design", "Web design"],
    answer: "Optimizing a linear objective function under linear constraints",
    category: "Operation Research"
  },
  {
    id: 1153,
    question: "Which method solves LP graphically?",
    options: ["Graphical method (for 2 variables)", "Big-M only", "PERT", "Markov"],
    answer: "Graphical method (for 2 variables)",
    category: "Operation Research"
  },
  {
    id: 1154,
    question: "Which is a popular algebraic method to solve LP?",
    options: ["Simplex method", "Bubble sort", "K-Means", "DFS"],
    answer: "Simplex method",
    category: "Operation Research"
  },
  {
    id: 1155,
    question: "What is the feasible region in LP?",
    options: ["Empty area", "Set of points satisfying all constraints", "Infeasible area", "An optimal point"],
    answer: "Set of points satisfying all constraints",
    category: "Operation Research"
  },
  {
    id: 1156,
    question: "Where does the optimum occur in an LP problem?",
    options: ["Anywhere", "At a vertex (corner point) of the feasible region", "Only at origin", "Only at midpoint"],
    answer: "At a vertex (corner point) of the feasible region",
    category: "Operation Research"
  },
  {
    id: 1157,
    question: "What is a slack variable?",
    options: ["A lazy variable", "A variable added to convert ≤ inequality into equality", "A backup", "A constant"],
    answer: "A variable added to convert ≤ inequality into equality",
    category: "Operation Research"
  },
  {
    id: 1158,
    question: "What is a surplus variable?",
    options: ["Variable subtracted to convert ≥ inequality into equality", "Slack variable", "A constant", "A backup"],
    answer: "Variable subtracted to convert ≥ inequality into equality",
    category: "Operation Research"
  },
  {
    id: 1159,
    question: "What is the dual of an LP?",
    options: ["A second LP related to the original; their optima are equal", "A copy", "An infeasible LP", "Backup"],
    answer: "A second LP related to the original; their optima are equal",
    category: "Operation Research"
  },
  {
    id: 1160,
    question: "What is sensitivity analysis in LP?",
    options: ["Encryption", "Studying how solution changes with changes in coefficients/constraints", "A backup", "A test"],
    answer: "Studying how solution changes with changes in coefficients/constraints",
    category: "Operation Research"
  },
  {
    id: 1161,
    question: "The transportation problem aims to:",
    options: ["Move people", "Minimize cost of transporting goods from sources to destinations", "Encrypt data", "Compile code"],
    answer: "Minimize cost of transporting goods from sources to destinations",
    category: "Operation Research"
  },
  {
    id: 1162,
    question: "Which method finds an initial feasible solution to transportation problem?",
    options: ["Northwest Corner / VAM / Least Cost", "Dijkstra", "BFS", "PERT"],
    answer: "Northwest Corner / VAM / Least Cost",
    category: "Operation Research"
  },
  {
    id: 1163,
    question: "What does VAM stand for?",
    options: ["Vogel's Approximation Method", "Vector Array Mode", "Variable Adjustment Module", "Visual Application Method"],
    answer: "Vogel's Approximation Method",
    category: "Operation Research"
  },
  {
    id: 1164,
    question: "What is the assignment problem?",
    options: ["Homework", "Optimally assigning n agents to n tasks to minimize cost", "A backup", "A schema"],
    answer: "Optimally assigning n agents to n tasks to minimize cost",
    category: "Operation Research"
  },
  {
    id: 1165,
    question: "Which method solves the assignment problem efficiently?",
    options: ["Hungarian method", "Simplex only", "K-Means", "Apriori"],
    answer: "Hungarian method",
    category: "Operation Research"
  },
  {
    id: 1166,
    question: "What is a network model in OR?",
    options: ["A computer network", "A graph-based model representing flow / connections to optimize", "A neural network", "A backup"],
    answer: "A graph-based model representing flow / connections to optimize",
    category: "Operation Research"
  },
  {
    id: 1167,
    question: "PERT and CPM are used for:",
    options: ["Project scheduling", "Encryption", "Compilation", "Sorting"],
    answer: "Project scheduling",
    category: "Operation Research"
  },
  {
    id: 1168,
    question: "Which problem finds the shortest path in a network?",
    options: ["Shortest path problem (e.g., Dijkstra's algorithm)", "Maximum flow", "Assignment", "Transportation"],
    answer: "Shortest path problem (e.g., Dijkstra's algorithm)",
    category: "Operation Research"
  },
  {
    id: 1169,
    question: "What is the maximum flow problem?",
    options: ["Drainage", "Finding the maximum amount of flow from source to sink in a network", "Transportation", "Assignment"],
    answer: "Finding the maximum amount of flow from source to sink in a network",
    category: "Operation Research"
  },
  {
    id: 1170,
    question: "Which algorithm solves max flow?",
    options: ["Ford-Fulkerson", "Dijkstra", "Bellman-Ford", "Prim's"],
    answer: "Ford-Fulkerson",
    category: "Operation Research"
  },
  {
    id: 1171,
    question: "What is Game Theory?",
    options: ["Studying video games", "Mathematical analysis of strategic decision-making among rational players", "Database design", "A backup"],
    answer: "Mathematical analysis of strategic decision-making among rational players",
    category: "Operation Research"
  },
  {
    id: 1172,
    question: "What is a zero-sum game?",
    options: ["A draw only", "A game where one player's gain equals the other's loss", "A cooperative game", "Mixed strategy"],
    answer: "A game where one player's gain equals the other's loss",
    category: "Operation Research"
  },
  {
    id: 1173,
    question: "What is a saddle point in a game?",
    options: ["A horse seat", "A pure strategy equilibrium where row min = column max", "A bug", "A node"],
    answer: "A pure strategy equilibrium where row min = column max",
    category: "Operation Research"
  },
  {
    id: 1174,
    question: "What is dynamic programming?",
    options: ["A web framework", "Solving complex problems by breaking them into overlapping subproblems and storing solutions", "Sorting", "Encryption"],
    answer: "Solving complex problems by breaking them into overlapping subproblems and storing solutions",
    category: "Operation Research"
  },
  {
    id: 1175,
    question: "Which is a queuing model?",
    options: ["M/M/1", "K-Means", "DFS", "BFS"],
    answer: "M/M/1",
    category: "Operation Research"
  },
  {
    id: 1176,
    question: "What is inventory management in OR?",
    options: ["Selling stock", "Optimizing levels of inventory to minimize total cost", "A backup process", "Encryption"],
    answer: "Optimizing levels of inventory to minimize total cost",
    category: "Operation Research"
  },
  {
    id: 1177,
    question: "What is EOQ?",
    options: ["Economic Order Quantity — minimizes total inventory cost", "Extended Operation Queue", "Equal Output Quota", "Ending Order Quote"],
    answer: "Economic Order Quantity — minimizes total inventory cost",
    category: "Operation Research"
  },
  {
    id: 1178,
    question: "Which is an assumption of basic EOQ?",
    options: ["Constant demand and lead time", "Random demand", "No holding cost", "No order cost"],
    answer: "Constant demand and lead time",
    category: "Operation Research"
  },
  {
    id: 1179,
    question: "What is a decision tree in OR?",
    options: ["A real tree", "A diagrammatic representation of decisions and their possible outcomes", "A clustering algorithm", "A backup"],
    answer: "A diagrammatic representation of decisions and their possible outcomes",
    category: "Operation Research"
  },
  {
    id: 1180,
    question: "What is integer programming?",
    options: ["Coding only", "LP where some/all variables are restricted to integers", "Continuous LP", "Encryption"],
    answer: "LP where some/all variables are restricted to integers",
    category: "Operation Research"
  },
  {
    id: 1181,
    question: "What is a 0/1 integer programming problem?",
    options: ["Variables can only be 0 or 1", "Variables are continuous", "Negative integers only", "Real-valued variables"],
    answer: "Variables can only be 0 or 1",
    category: "Operation Research"
  },
  {
    id: 1182,
    question: "Which technique is used for 0/1 problems?",
    options: ["Branch and Bound", "K-Means", "Apriori", "DFS"],
    answer: "Branch and Bound",
    category: "Operation Research"
  },
  {
    id: 1183,
    question: "What is the goal of OR?",
    options: ["Help managers make better decisions through quantitative analysis", "Encryption", "Backup", "Compilation"],
    answer: "Help managers make better decisions through quantitative analysis",
    category: "Operation Research"
  },
  {
    id: 1184,
    question: "What is a constraint in optimization?",
    options: ["A limitation that solutions must satisfy", "An objective", "A backup", "An index"],
    answer: "A limitation that solutions must satisfy",
    category: "Operation Research"
  },
  {
    id: 1185,
    question: "What is the objective function?",
    options: ["A constraint", "The function being maximized or minimized", "A backup", "Random data"],
    answer: "The function being maximized or minimized",
    category: "Operation Research"
  },
  {
    id: 1186,
    question: "Which type of problem can be unbounded?",
    options: ["LP with no upper bound on objective", "Always feasible", "Always bounded", "Never possible"],
    answer: "LP with no upper bound on objective",
    category: "Operation Research"
  },
  {
    id: 1187,
    question: "What is degeneracy in LP?",
    options: ["A solution being feasible", "A basic feasible solution where one or more basic variables are zero", "An infeasible solution", "A backup"],
    answer: "A basic feasible solution where one or more basic variables are zero",
    category: "Operation Research"
  },
  {
    id: 1188,
    question: "What is the simplex tableau?",
    options: ["A dinner table", "A tabular form used to perform simplex method iterations", "A spreadsheet only", "A schema"],
    answer: "A tabular form used to perform simplex method iterations",
    category: "Operation Research"
  },
  {
    id: 1189,
    question: "What is a balanced transportation problem?",
    options: ["Total supply equals total demand", "Demand exceeds supply", "Supply exceeds demand", "Empty"],
    answer: "Total supply equals total demand",
    category: "Operation Research"
  },
  {
    id: 1190,
    question: "How is an unbalanced transportation problem handled?",
    options: ["By adding a dummy source/destination", "Encryption", "Compilation", "Cannot be handled"],
    answer: "By adding a dummy source/destination",
    category: "Operation Research"
  },
  {
    id: 1191,
    question: "What is goal programming?",
    options: ["Coaching", "Multi-objective optimization aiming to satisfy goals as closely as possible", "A backup", "Encryption"],
    answer: "Multi-objective optimization aiming to satisfy goals as closely as possible",
    category: "Operation Research"
  },
  {
    id: 1192,
    question: "What does 'NP-hard' mean for OR problems?",
    options: ["Easy to solve", "No known polynomial-time algorithm to solve in general", "Always solvable in seconds", "Fully solved"],
    answer: "No known polynomial-time algorithm to solve in general",
    category: "Operation Research"
  },
  {
    id: 1193,
    question: "What is a heuristic?",
    options: ["An exact algorithm", "A practical method for finding good (not necessarily optimal) solutions quickly", "A backup", "Encryption"],
    answer: "A practical method for finding good (not necessarily optimal) solutions quickly",
    category: "Operation Research"
  },
  {
    id: 1194,
    question: "What is metaheuristic?",
    options: ["A higher-level strategy guiding heuristics (e.g., genetic algorithms)", "An exact method", "A backup", "Encryption"],
    answer: "A higher-level strategy guiding heuristics (e.g., genetic algorithms)",
    category: "Operation Research"
  },
  {
    id: 1195,
    question: "Which is a metaheuristic?",
    options: ["Simulated Annealing", "Simplex", "Hungarian", "DFS"],
    answer: "Simulated Annealing",
    category: "Operation Research"
  },
  {
    id: 1196,
    question: "What is the traveling salesman problem (TSP)?",
    options: ["Finding shortest route visiting each city once and returning to origin", "Assignment problem", "Transportation problem", "Max flow"],
    answer: "Finding shortest route visiting each city once and returning to origin",
    category: "Operation Research"
  },
  {
    id: 1197,
    question: "Why is TSP hard?",
    options: ["Trivial", "It is NP-hard with combinatorial explosion of routes", "Only one solution exists", "Always linear time"],
    answer: "It is NP-hard with combinatorial explosion of routes",
    category: "Operation Research"
  },
  {
    id: 1198,
    question: "What is queuing theory used for?",
    options: ["Studying waiting lines and service systems", "Encryption", "Cooking", "Backup"],
    answer: "Studying waiting lines and service systems",
    category: "Operation Research"
  },
  {
    id: 1199,
    question: "Which is used to model arrivals in queues?",
    options: ["Poisson process", "Linear search", "BFS", "DFS"],
    answer: "Poisson process",
    category: "Operation Research"
  },
  {
    id: 1200,
    question: "What does L stand for in queuing theory (Little's Law: L = λW)?",
    options: ["Average number of customers in the system", "Service rate", "Time", "Loss"],
    answer: "Average number of customers in the system",
    category: "Operation Research"
  },
  {
    id: 1201,
    question: "What is the derivative of x² with respect to x?",
    options: ["x", "2x", "x²", "2"],
    answer: "2x",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1202,
    question: "What is the derivative of a constant?",
    options: ["1", "0", "x", "Undefined"],
    answer: "0",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1203,
    question: "What is the derivative of sin(x)?",
    options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"],
    answer: "cos(x)",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1204,
    question: "What is the derivative of cos(x)?",
    options: ["sin(x)", "-sin(x)", "tan(x)", "-cos(x)"],
    answer: "-sin(x)",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1205,
    question: "What is the derivative of e^x?",
    options: ["x e^(x-1)", "e^x", "e", "x"],
    answer: "e^x",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1206,
    question: "What is the derivative of ln(x)?",
    options: ["1/x", "x", "ln(1/x)", "1"],
    answer: "1/x",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1207,
    question: "What is ∫x dx?",
    options: ["x² + C", "x²/2 + C", "2x + C", "1 + C"],
    answer: "x²/2 + C",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1208,
    question: "What is ∫ 1/x dx?",
    options: ["1 + C", "ln|x| + C", "x + C", "e^x + C"],
    answer: "ln|x| + C",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1209,
    question: "What does a derivative measure?",
    options: ["Area", "Instantaneous rate of change", "Volume", "An angle"],
    answer: "Instantaneous rate of change",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1210,
    question: "What does an integral measure?",
    options: ["Slope", "Accumulated quantity / area under curve", "Random number", "Volume only"],
    answer: "Accumulated quantity / area under curve",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1211,
    question: "What is the limit of (sin x)/x as x → 0?",
    options: ["0", "1", "∞", "Undefined"],
    answer: "1",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1212,
    question: "Which rule is used to differentiate a product of two functions?",
    options: ["Product rule", "Chain rule", "Power rule", "Quotient rule"],
    answer: "Product rule",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1213,
    question: "Which rule differentiates composite functions?",
    options: ["Product rule", "Chain rule", "Quotient rule", "L'Hopital"],
    answer: "Chain rule",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1214,
    question: "Which rule helps with limits of indeterminate forms (0/0 or ∞/∞)?",
    options: ["Power rule", "L'Hopital's rule", "Quotient rule", "Product rule"],
    answer: "L'Hopital's rule",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1215,
    question: "What is the second derivative used for?",
    options: ["Area", "Concavity / acceleration", "Volume", "Definite integral"],
    answer: "Concavity / acceleration",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1216,
    question: "If f'(x) = 0 and f''(x) > 0, then x is:",
    options: ["A local maximum", "A local minimum", "An inflection point", "Undefined"],
    answer: "A local minimum",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1217,
    question: "If f'(x) = 0 and f''(x) < 0, then x is:",
    options: ["A local minimum", "A local maximum", "An inflection point", "Saddle point"],
    answer: "A local maximum",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1218,
    question: "What is the integral of sin(x)?",
    options: ["cos(x) + C", "-cos(x) + C", "tan(x) + C", "sec(x) + C"],
    answer: "-cos(x) + C",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1219,
    question: "What is the integral of cos(x)?",
    options: ["sin(x) + C", "-sin(x) + C", "tan(x) + C", "cos(x) + C"],
    answer: "sin(x) + C",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1220,
    question: "What is the slope of a horizontal line?",
    options: ["1", "0", "Undefined", "∞"],
    answer: "0",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1221,
    question: "What is the slope of a vertical line?",
    options: ["0", "1", "Undefined", "-1"],
    answer: "Undefined",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1222,
    question: "The slope-intercept form of a line is:",
    options: ["y = mx + c", "ax + by = c", "y² = 4ax", "x² + y² = r²"],
    answer: "y = mx + c",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1223,
    question: "Equation of a circle centered at origin with radius r:",
    options: ["x² + y² = r²", "x² - y² = r²", "y = mx + c", "x + y = r"],
    answer: "x² + y² = r²",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1224,
    question: "What is the distance between (x1,y1) and (x2,y2)?",
    options: ["sqrt((x2-x1)² + (y2-y1)²)", "(x2-x1) + (y2-y1)", "abs(x2-x1)", "(x2-x1)*(y2-y1)"],
    answer: "sqrt((x2-x1)² + (y2-y1)²)",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1225,
    question: "Midpoint of (x1,y1) and (x2,y2):",
    options: ["((x1+x2)/2, (y1+y2)/2)", "(x1*x2, y1*y2)", "(x1+x2, y1+y2)", "(0,0)"],
    answer: "((x1+x2)/2, (y1+y2)/2)",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1226,
    question: "What is the equation of a parabola opening upward with vertex at origin?",
    options: ["y = x²", "x = y²", "y² = -4ax", "x² + y² = r²"],
    answer: "y = x²",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1227,
    question: "What is the standard form of an ellipse?",
    options: ["x²/a² + y²/b² = 1", "x² + y² = r²", "y = mx + c", "y = ax² + bx + c"],
    answer: "x²/a² + y²/b² = 1",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1228,
    question: "What is the standard form of a hyperbola?",
    options: ["x²/a² - y²/b² = 1", "x² + y² = r²", "y = ax + b", "y² = 4ax"],
    answer: "x²/a² - y²/b² = 1",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1229,
    question: "If two lines are parallel, their slopes are:",
    options: ["Negative reciprocals", "Equal", "Always 0", "Undefined"],
    answer: "Equal",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1230,
    question: "If two lines are perpendicular, their slopes are:",
    options: ["Equal", "Negative reciprocals (m1*m2 = -1)", "Both 0", "Both undefined"],
    answer: "Negative reciprocals (m1*m2 = -1)",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1231,
    question: "What is a definite integral?",
    options: ["Indefinite", "An integral evaluated between two bounds, giving a numerical value", "A derivative", "A limit"],
    answer: "An integral evaluated between two bounds, giving a numerical value",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1232,
    question: "What is an indefinite integral?",
    options: ["Definite", "An antiderivative with a constant of integration", "A definite area", "A derivative"],
    answer: "An antiderivative with a constant of integration",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1233,
    question: "What is the Fundamental Theorem of Calculus about?",
    options: ["Derivative-integral relationship", "Pythagoras", "Geometry only", "Limits only"],
    answer: "Derivative-integral relationship",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1234,
    question: "Which method is used to integrate by substitution?",
    options: ["u-substitution", "Integration by parts", "Partial fractions", "L'Hopital"],
    answer: "u-substitution",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1235,
    question: "Integration by parts formula is:",
    options: ["∫u dv = uv - ∫v du", "∫u dv = u/v", "∫(u+v) = ∫u - ∫v", "∫u² dv = uv²"],
    answer: "∫u dv = uv - ∫v du",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1236,
    question: "What is the area of a circle of radius r?",
    options: ["πr²", "2πr", "πd", "r²"],
    answer: "πr²",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1237,
    question: "What is the circumference of a circle of radius r?",
    options: ["πr²", "2πr", "πr", "r²"],
    answer: "2πr",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1238,
    question: "Volume of a sphere of radius r?",
    options: ["(4/3)πr³", "πr³", "4πr²", "(2/3)πr²"],
    answer: "(4/3)πr³",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1239,
    question: "Surface area of a sphere?",
    options: ["4πr²", "πr²", "2πr", "(4/3)πr³"],
    answer: "4πr²",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1240,
    question: "What is the value of π approximately?",
    options: ["3.14159", "2.71828", "1.61803", "0.57721"],
    answer: "3.14159",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1241,
    question: "What is e (Euler's number) approximately?",
    options: ["3.14", "2.718", "1.61", "1.41"],
    answer: "2.718",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1242,
    question: "What is a tangent line?",
    options: ["A line that intersects the curve at every point", "A line that touches the curve at one point and has same slope", "Always perpendicular", "Always horizontal"],
    answer: "A line that touches the curve at one point and has same slope",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1243,
    question: "What does continuity mean for a function?",
    options: ["No breaks/jumps in the function", "Always increasing", "Always positive", "Linear"],
    answer: "No breaks/jumps in the function",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1244,
    question: "What is the derivative of tan(x)?",
    options: ["sec²(x)", "csc(x)", "cot(x)", "-sec(x)"],
    answer: "sec²(x)",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1245,
    question: "What is the integral of sec²(x)?",
    options: ["tan(x) + C", "cot(x) + C", "sin(x) + C", "csc(x) + C"],
    answer: "tan(x) + C",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1246,
    question: "What is a partial derivative?",
    options: ["A part of derivative", "Derivative of a multivariable function with respect to one variable, holding others constant", "Total derivative", "Implicit derivative"],
    answer: "Derivative of a multivariable function with respect to one variable, holding others constant",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1247,
    question: "What is the gradient of a scalar field?",
    options: ["A scalar", "A vector of partial derivatives pointing in direction of greatest increase", "A constant", "A divergence"],
    answer: "A vector of partial derivatives pointing in direction of greatest increase",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1248,
    question: "What does the area under a velocity-time graph represent?",
    options: ["Acceleration", "Distance / displacement", "Speed", "Force"],
    answer: "Distance / displacement",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1249,
    question: "The slope of a position-time graph represents:",
    options: ["Force", "Velocity", "Acceleration", "Distance"],
    answer: "Velocity",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1250,
    question: "Which 3D shape has equation x² + y² + z² = r²?",
    options: ["Sphere", "Cylinder", "Cone", "Plane"],
    answer: "Sphere",
    category: "Calculus and Analytical Geometry"
  },
  {
    id: 1251,
    question: "What is a matrix?",
    options: ["A type of array", "A rectangular arrangement of numbers in rows and columns", "A vector only", "A scalar"],
    answer: "A rectangular arrangement of numbers in rows and columns",
    category: "Linear Algebra"
  },
  {
    id: 1252,
    question: "A matrix with m rows and n columns has order:",
    options: ["m+n", "m*n", "m×n", "n−m"],
    answer: "m×n",
    category: "Linear Algebra"
  },
  {
    id: 1253,
    question: "A square matrix has:",
    options: ["More rows than columns", "Equal number of rows and columns", "More columns than rows", "Only one row"],
    answer: "Equal number of rows and columns",
    category: "Linear Algebra"
  },
  {
    id: 1254,
    question: "What is an identity matrix?",
    options: ["All zeros", "Square matrix with 1s on diagonal and 0s elsewhere", "All ones", "All same numbers"],
    answer: "Square matrix with 1s on diagonal and 0s elsewhere",
    category: "Linear Algebra"
  },
  {
    id: 1255,
    question: "What is a zero matrix?",
    options: ["All elements are zero", "Identity matrix", "Diagonal matrix", "Symmetric matrix"],
    answer: "All elements are zero",
    category: "Linear Algebra"
  },
  {
    id: 1256,
    question: "What is a diagonal matrix?",
    options: ["All zero", "Square matrix with non-zero entries only on the diagonal", "All same elements", "Identity"],
    answer: "Square matrix with non-zero entries only on the diagonal",
    category: "Linear Algebra"
  },
  {
    id: 1257,
    question: "What is the transpose of a matrix?",
    options: ["Multiplying by 2", "Swapping rows and columns", "Inverting", "Squaring"],
    answer: "Swapping rows and columns",
    category: "Linear Algebra"
  },
  {
    id: 1258,
    question: "What is a symmetric matrix?",
    options: ["A = -A", "A = A^T", "A = 0", "A = I"],
    answer: "A = A^T",
    category: "Linear Algebra"
  },
  {
    id: 1259,
    question: "What is a skew-symmetric matrix?",
    options: ["A = A^T", "A^T = -A", "A = 0", "A is invertible"],
    answer: "A^T = -A",
    category: "Linear Algebra"
  },
  {
    id: 1260,
    question: "Two matrices can be added only if they:",
    options: ["Have the same dimensions", "Are square", "Are diagonal", "Are symmetric"],
    answer: "Have the same dimensions",
    category: "Linear Algebra"
  },
  {
    id: 1261,
    question: "Matrix multiplication AB is defined when:",
    options: ["A's columns equal B's rows", "Both are square", "Same dimensions", "Both diagonal"],
    answer: "A's columns equal B's rows",
    category: "Linear Algebra"
  },
  {
    id: 1262,
    question: "Is matrix multiplication commutative?",
    options: ["Yes always", "No, AB ≠ BA in general", "Only for diagonal matrices", "Only for vectors"],
    answer: "No, AB ≠ BA in general",
    category: "Linear Algebra"
  },
  {
    id: 1263,
    question: "What is the determinant of a 2x2 matrix [[a,b],[c,d]]?",
    options: ["ad - bc", "ab + cd", "a + d", "ac - bd"],
    answer: "ad - bc",
    category: "Linear Algebra"
  },
  {
    id: 1264,
    question: "If det(A) = 0, the matrix A is:",
    options: ["Invertible", "Singular (non-invertible)", "Symmetric", "Identity"],
    answer: "Singular (non-invertible)",
    category: "Linear Algebra"
  },
  {
    id: 1265,
    question: "What is the inverse of A denoted by?",
    options: ["A^T", "A^-1", "A²", "|A|"],
    answer: "A^-1",
    category: "Linear Algebra"
  },
  {
    id: 1266,
    question: "A * A^-1 equals:",
    options: ["0", "I (identity)", "A^T", "A²"],
    answer: "I (identity)",
    category: "Linear Algebra"
  },
  {
    id: 1267,
    question: "What is the rank of a matrix?",
    options: ["Number of rows", "Maximum number of linearly independent rows/columns", "Determinant", "Diagonal sum"],
    answer: "Maximum number of linearly independent rows/columns",
    category: "Linear Algebra"
  },
  {
    id: 1268,
    question: "What is a vector?",
    options: ["A matrix only", "A quantity with magnitude and direction; an ordered tuple of numbers", "A scalar", "A constant"],
    answer: "A quantity with magnitude and direction; an ordered tuple of numbers",
    category: "Linear Algebra"
  },
  {
    id: 1269,
    question: "What is the dot product of two vectors u and v?",
    options: ["A vector", "A scalar = u₁v₁ + u₂v₂ + ...", "A matrix", "A constant 0"],
    answer: "A scalar = u₁v₁ + u₂v₂ + ...",
    category: "Linear Algebra"
  },
  {
    id: 1270,
    question: "If u·v = 0 (and u, v ≠ 0), then u and v are:",
    options: ["Parallel", "Orthogonal (perpendicular)", "Identical", "Linear"],
    answer: "Orthogonal (perpendicular)",
    category: "Linear Algebra"
  },
  {
    id: 1271,
    question: "What is the cross product of two 3D vectors?",
    options: ["A scalar", "A vector orthogonal to both", "Always zero", "Same as dot product"],
    answer: "A vector orthogonal to both",
    category: "Linear Algebra"
  },
  {
    id: 1272,
    question: "What is a linear combination?",
    options: ["Random sum", "An expression formed by scaling and adding vectors", "Cross product only", "A determinant"],
    answer: "An expression formed by scaling and adding vectors",
    category: "Linear Algebra"
  },
  {
    id: 1273,
    question: "Vectors v1, v2, ..., vn are linearly independent if:",
    options: ["One is a multiple of another", "No vector can be expressed as a linear combination of others", "All are zero", "All are the same"],
    answer: "No vector can be expressed as a linear combination of others",
    category: "Linear Algebra"
  },
  {
    id: 1274,
    question: "What is a basis of a vector space?",
    options: ["Empty set", "A linearly independent set that spans the space", "Any set", "Only one vector"],
    answer: "A linearly independent set that spans the space",
    category: "Linear Algebra"
  },
  {
    id: 1275,
    question: "What is the dimension of a vector space?",
    options: ["Number of vectors", "Number of vectors in any basis", "Number of elements", "Determinant"],
    answer: "Number of vectors in any basis",
    category: "Linear Algebra"
  },
  {
    id: 1276,
    question: "What is an eigenvalue?",
    options: ["A scalar λ such that Av = λv for some non-zero v", "Always 0", "A vector", "A matrix"],
    answer: "A scalar λ such that Av = λv for some non-zero v",
    category: "Linear Algebra"
  },
  {
    id: 1277,
    question: "What is an eigenvector?",
    options: ["A vector v such that Av = λv (with non-zero v)", "A scalar", "Always the zero vector", "A matrix"],
    answer: "A vector v such that Av = λv (with non-zero v)",
    category: "Linear Algebra"
  },
  {
    id: 1278,
    question: "Which equation finds eigenvalues?",
    options: ["det(A - λI) = 0", "A = 0", "Av = 0", "A^T = A"],
    answer: "det(A - λI) = 0",
    category: "Linear Algebra"
  },
  {
    id: 1279,
    question: "What is the trace of a matrix?",
    options: ["Sum of diagonal elements", "Sum of all elements", "Determinant", "Rank"],
    answer: "Sum of diagonal elements",
    category: "Linear Algebra"
  },
  {
    id: 1280,
    question: "Sum of eigenvalues equals:",
    options: ["Determinant", "Trace", "Rank", "0"],
    answer: "Trace",
    category: "Linear Algebra"
  },
  {
    id: 1281,
    question: "Product of eigenvalues equals:",
    options: ["Trace", "Determinant", "Rank", "0"],
    answer: "Determinant",
    category: "Linear Algebra"
  },
  {
    id: 1282,
    question: "A homogeneous system Ax = 0 always has:",
    options: ["No solution", "At least the trivial solution x = 0", "Unique non-zero solution always", "Infinite solutions always"],
    answer: "At least the trivial solution x = 0",
    category: "Linear Algebra"
  },
  {
    id: 1283,
    question: "Which method solves linear systems via row operations?",
    options: ["Gaussian elimination", "FFT", "K-Means", "Apriori"],
    answer: "Gaussian elimination",
    category: "Linear Algebra"
  },
  {
    id: 1284,
    question: "What is the result of multiplying a matrix by the identity matrix?",
    options: ["The same matrix", "Zero matrix", "Inverse", "Transpose"],
    answer: "The same matrix",
    category: "Linear Algebra"
  },
  {
    id: 1285,
    question: "Which form is reached after Gaussian elimination?",
    options: ["Row echelon form", "Cube form", "Diagonal only", "Symmetric only"],
    answer: "Row echelon form",
    category: "Linear Algebra"
  },
  {
    id: 1286,
    question: "What is a linear transformation?",
    options: ["Random function", "A mapping T(u+v)=T(u)+T(v) and T(cu)=cT(u)", "Only on vectors of length 1", "A backup"],
    answer: "A mapping T(u+v)=T(u)+T(v) and T(cu)=cT(u)",
    category: "Linear Algebra"
  },
  {
    id: 1287,
    question: "What represents a linear transformation?",
    options: ["A scalar", "A matrix", "A polynomial only", "A constant"],
    answer: "A matrix",
    category: "Linear Algebra"
  },
  {
    id: 1288,
    question: "What is the null space of A?",
    options: ["All x such that Ax = 0", "All x such that Ax = b", "All vectors", "Identity matrix"],
    answer: "All x such that Ax = 0",
    category: "Linear Algebra"
  },
  {
    id: 1289,
    question: "What is the column space of A?",
    options: ["Empty set", "Span of A's columns", "Inverse of A", "Trace"],
    answer: "Span of A's columns",
    category: "Linear Algebra"
  },
  {
    id: 1290,
    question: "Rank-nullity theorem says:",
    options: ["rank(A) + nullity(A) = number of columns", "rank(A) = trace(A)", "rank(A) = det(A)", "nullity = 0 always"],
    answer: "rank(A) + nullity(A) = number of columns",
    category: "Linear Algebra"
  },
  {
    id: 1291,
    question: "An orthogonal matrix Q satisfies:",
    options: ["Q^T Q = I", "Q² = 0", "Q = -Q^T", "Q is singular"],
    answer: "Q^T Q = I",
    category: "Linear Algebra"
  },
  {
    id: 1292,
    question: "What is a unit vector?",
    options: ["A vector of length 0", "A vector of length 1", "A diagonal vector", "A zero vector"],
    answer: "A vector of length 1",
    category: "Linear Algebra"
  },
  {
    id: 1293,
    question: "What is the norm (magnitude) of vector v=(v1,v2,v3)?",
    options: ["v1+v2+v3", "sqrt(v1²+v2²+v3²)", "v1*v2*v3", "max(v1,v2,v3)"],
    answer: "sqrt(v1²+v2²+v3²)",
    category: "Linear Algebra"
  },
  {
    id: 1294,
    question: "What does SVD stand for?",
    options: ["Singular Value Decomposition", "Standard Vector Decomposition", "Symmetric Vector Distribution", "Scalar Value Diff"],
    answer: "Singular Value Decomposition",
    category: "Linear Algebra"
  },
  {
    id: 1295,
    question: "Which decomposition writes A = LU?",
    options: ["LU decomposition", "QR decomposition", "SVD", "Eigendecomposition"],
    answer: "LU decomposition",
    category: "Linear Algebra"
  },
  {
    id: 1296,
    question: "Which decomposition writes A = QR (Q orthogonal, R upper triangular)?",
    options: ["LU", "QR", "Cholesky", "SVD"],
    answer: "QR",
    category: "Linear Algebra"
  },
  {
    id: 1297,
    question: "What is Cholesky decomposition used for?",
    options: ["Symmetric positive-definite matrices factored as A = LL^T", "Any matrix", "Singular matrices", "Zero matrices"],
    answer: "Symmetric positive-definite matrices factored as A = LL^T",
    category: "Linear Algebra"
  },
  {
    id: 1298,
    question: "Which of the following is true about matrix addition?",
    options: ["Commutative", "Non-commutative", "Not associative", "Requires square matrices"],
    answer: "Commutative",
    category: "Linear Algebra"
  },
  {
    id: 1299,
    question: "If A is invertible, det(A) is:",
    options: ["0", "Non-zero", "Always 1", "Undefined"],
    answer: "Non-zero",
    category: "Linear Algebra"
  },
  {
    id: 1300,
    question: "Solving Ax = b uniquely requires:",
    options: ["A is non-square", "A is invertible (square, det ≠ 0)", "b = 0 always", "x = 0 always"],
    answer: "A is invertible (square, det ≠ 0)",
    category: "Linear Algebra"
  },
  {
    id: 1301,
    question: "What is probability?",
    options: ["A guess", "A measure of the likelihood of an event, between 0 and 1", "A negative number", "A frequency only"],
    answer: "A measure of the likelihood of an event, between 0 and 1",
    category: "Probability and Statistics"
  },
  {
    id: 1302,
    question: "What is the probability of a sure event?",
    options: ["0", "1", "0.5", "Undefined"],
    answer: "1",
    category: "Probability and Statistics"
  },
  {
    id: 1303,
    question: "What is the probability of an impossible event?",
    options: ["0", "1", "0.5", "-1"],
    answer: "0",
    category: "Probability and Statistics"
  },
  {
    id: 1304,
    question: "Probability of getting a head on a fair coin flip?",
    options: ["1", "0", "0.5", "0.25"],
    answer: "0.5",
    category: "Probability and Statistics"
  },
  {
    id: 1305,
    question: "Probability of rolling a 6 on a fair die?",
    options: ["1/2", "1/3", "1/6", "1/12"],
    answer: "1/6",
    category: "Probability and Statistics"
  },
  {
    id: 1306,
    question: "Sum of all probabilities of outcomes in a sample space equals:",
    options: ["0", "1", "0.5", "Depends"],
    answer: "1",
    category: "Probability and Statistics"
  },
  {
    id: 1307,
    question: "Two events are mutually exclusive if:",
    options: ["They can occur together", "They cannot occur together", "They are independent", "Their probabilities are equal"],
    answer: "They cannot occur together",
    category: "Probability and Statistics"
  },
  {
    id: 1308,
    question: "Two events A and B are independent if:",
    options: ["P(A∩B) = 0", "P(A∩B) = P(A)*P(B)", "A causes B", "P(A) = P(B)"],
    answer: "P(A∩B) = P(A)*P(B)",
    category: "Probability and Statistics"
  },
  {
    id: 1309,
    question: "What is conditional probability P(A|B)?",
    options: ["P(A∩B)/P(B)", "P(A) + P(B)", "P(A) * P(B)", "P(A) - P(B)"],
    answer: "P(A∩B)/P(B)",
    category: "Probability and Statistics"
  },
  {
    id: 1310,
    question: "Bayes' theorem relates:",
    options: ["Two unrelated probabilities", "P(A|B) and P(B|A)", "Means and variances", "Trace and determinant"],
    answer: "P(A|B) and P(B|A)",
    category: "Probability and Statistics"
  },
  {
    id: 1311,
    question: "What is a random variable?",
    options: ["A constant", "A variable whose value depends on the outcome of a random event", "An eigenvalue", "A determinant"],
    answer: "A variable whose value depends on the outcome of a random event",
    category: "Probability and Statistics"
  },
  {
    id: 1312,
    question: "What is the expected value of a random variable X?",
    options: ["Mean / weighted average of X", "Maximum value", "Minimum value", "Mode"],
    answer: "Mean / weighted average of X",
    category: "Probability and Statistics"
  },
  {
    id: 1313,
    question: "What is variance?",
    options: ["Mean", "A measure of dispersion: E[(X−μ)²]", "Mode", "Median"],
    answer: "A measure of dispersion: E[(X−μ)²]",
    category: "Probability and Statistics"
  },
  {
    id: 1314,
    question: "Standard deviation is:",
    options: ["Square of variance", "Square root of variance", "Mean of squares", "Always zero"],
    answer: "Square root of variance",
    category: "Probability and Statistics"
  },
  {
    id: 1315,
    question: "What is the mean of {2,4,6,8}?",
    options: ["4", "5", "6", "8"],
    answer: "5",
    category: "Probability and Statistics"
  },
  {
    id: 1316,
    question: "What is the median of {1,3,5,7,9}?",
    options: ["1", "3", "5", "9"],
    answer: "5",
    category: "Probability and Statistics"
  },
  {
    id: 1317,
    question: "What is the mode of {2,2,3,4,4,4,5}?",
    options: ["2", "3", "4", "5"],
    answer: "4",
    category: "Probability and Statistics"
  },
  {
    id: 1318,
    question: "Which is the most affected by outliers?",
    options: ["Median", "Mean", "Mode", "Range"],
    answer: "Mean",
    category: "Probability and Statistics"
  },
  {
    id: 1319,
    question: "Which discrete distribution models the number of successes in n independent trials?",
    options: ["Normal", "Binomial", "Exponential", "Uniform"],
    answer: "Binomial",
    category: "Probability and Statistics"
  },
  {
    id: 1320,
    question: "Which distribution models rare events over a fixed interval?",
    options: ["Normal", "Poisson", "Binomial", "Uniform"],
    answer: "Poisson",
    category: "Probability and Statistics"
  },
  {
    id: 1321,
    question: "The Normal distribution is also called:",
    options: ["Bell curve / Gaussian", "Square distribution", "Triangular distribution", "Poisson"],
    answer: "Bell curve / Gaussian",
    category: "Probability and Statistics"
  },
  {
    id: 1322,
    question: "What percentage of data lies within 1 standard deviation of the mean in a normal distribution?",
    options: ["About 50%", "About 68%", "About 95%", "About 99.7%"],
    answer: "About 68%",
    category: "Probability and Statistics"
  },
  {
    id: 1323,
    question: "What percentage lies within 2 standard deviations?",
    options: ["68%", "About 95%", "100%", "50%"],
    answer: "About 95%",
    category: "Probability and Statistics"
  },
  {
    id: 1324,
    question: "What is the central limit theorem (CLT)?",
    options: ["Sample mean of large samples is approximately normal regardless of population distribution", "All distributions are normal", "Variance is always 1", "Mean equals mode always"],
    answer: "Sample mean of large samples is approximately normal regardless of population distribution",
    category: "Probability and Statistics"
  },
  {
    id: 1325,
    question: "What is a sample?",
    options: ["The whole population", "A subset of the population used for analysis", "A single data point", "An average"],
    answer: "A subset of the population used for analysis",
    category: "Probability and Statistics"
  },
  {
    id: 1326,
    question: "What is a parameter (vs. statistic)?",
    options: ["A characteristic of the population", "A characteristic of a sample", "A test result", "Always 0"],
    answer: "A characteristic of the population",
    category: "Probability and Statistics"
  },
  {
    id: 1327,
    question: "What is the null hypothesis (H₀)?",
    options: ["The hypothesis you want to prove", "A default statement of no effect/difference", "Always rejected", "Always accepted"],
    answer: "A default statement of no effect/difference",
    category: "Probability and Statistics"
  },
  {
    id: 1328,
    question: "What does a p-value represent?",
    options: ["Probability of result being correct", "Probability of observing data as extreme as observed if H₀ is true", "Probability H₀ is true", "Sample size"],
    answer: "Probability of observing data as extreme as observed if H₀ is true",
    category: "Probability and Statistics"
  },
  {
    id: 1329,
    question: "If p-value < significance level (α), we usually:",
    options: ["Accept H₀", "Reject H₀", "Ignore the test", "Increase sample size"],
    answer: "Reject H₀",
    category: "Probability and Statistics"
  },
  {
    id: 1330,
    question: "What is a Type I error?",
    options: ["Rejecting H₀ when it is actually true", "Accepting H₀ when it is false", "Sampling error", "Calculation error"],
    answer: "Rejecting H₀ when it is actually true",
    category: "Probability and Statistics"
  },
  {
    id: 1331,
    question: "What is a Type II error?",
    options: ["Failing to reject H₀ when it is actually false", "Rejecting H₀ when true", "A sampling bias", "Always 0"],
    answer: "Failing to reject H₀ when it is actually false",
    category: "Probability and Statistics"
  },
  {
    id: 1332,
    question: "What is a confidence interval?",
    options: ["A range of values likely containing the true parameter with given probability", "A point estimate", "A bias", "A median"],
    answer: "A range of values likely containing the true parameter with given probability",
    category: "Probability and Statistics"
  },
  {
    id: 1333,
    question: "What is correlation?",
    options: ["Causation", "A statistical measure describing how two variables move together", "A sample size", "A median"],
    answer: "A statistical measure describing how two variables move together",
    category: "Probability and Statistics"
  },
  {
    id: 1334,
    question: "What is the range of Pearson's correlation coefficient?",
    options: ["[0, 1]", "[-1, 1]", "[0, ∞)", "All real numbers"],
    answer: "[-1, 1]",
    category: "Probability and Statistics"
  },
  {
    id: 1335,
    question: "Correlation does NOT imply:",
    options: ["Association", "Causation", "Relationship", "Pattern"],
    answer: "Causation",
    category: "Probability and Statistics"
  },
  {
    id: 1336,
    question: "What is regression analysis?",
    options: ["Encryption", "Estimating the relationship between a dependent and one or more independent variables", "Clustering", "Backup"],
    answer: "Estimating the relationship between a dependent and one or more independent variables",
    category: "Probability and Statistics"
  },
  {
    id: 1337,
    question: "In simple linear regression, the model is:",
    options: ["y = mx + c + ε", "y = x²", "y = sin(x)", "y = e^x"],
    answer: "y = mx + c + ε",
    category: "Probability and Statistics"
  },
  {
    id: 1338,
    question: "What does R² (coefficient of determination) measure?",
    options: ["Proportion of variance explained by the model", "Sample size", "Mean", "Mode"],
    answer: "Proportion of variance explained by the model",
    category: "Probability and Statistics"
  },
  {
    id: 1339,
    question: "What is a histogram?",
    options: ["A pie chart", "A bar chart showing frequency distribution of numerical data", "A scatter plot", "A box plot"],
    answer: "A bar chart showing frequency distribution of numerical data",
    category: "Probability and Statistics"
  },
  {
    id: 1340,
    question: "What is a box plot used for?",
    options: ["Showing distribution via quartiles, median, outliers", "Showing time series only", "Showing categorical data", "Showing correlation only"],
    answer: "Showing distribution via quartiles, median, outliers",
    category: "Probability and Statistics"
  },
  {
    id: 1341,
    question: "What is a scatter plot used for?",
    options: ["Showing relationship between two numerical variables", "Showing single variable", "Time only", "Frequency only"],
    answer: "Showing relationship between two numerical variables",
    category: "Probability and Statistics"
  },
  {
    id: 1342,
    question: "What is sampling bias?",
    options: ["Random sampling", "When the sample is not representative of the population", "Equal probability for all", "Smaller variance"],
    answer: "When the sample is not representative of the population",
    category: "Probability and Statistics"
  },
  {
    id: 1343,
    question: "Which is a probability sampling method?",
    options: ["Convenience sampling", "Simple random sampling", "Snowball sampling", "Quota sampling"],
    answer: "Simple random sampling",
    category: "Probability and Statistics"
  },
  {
    id: 1344,
    question: "Which test compares means of two independent groups?",
    options: ["Chi-square", "Independent t-test", "ANOVA only", "Z-correlation"],
    answer: "Independent t-test",
    category: "Probability and Statistics"
  },
  {
    id: 1345,
    question: "Which test compares means of three or more groups?",
    options: ["t-test", "ANOVA", "Chi-square", "Pearson"],
    answer: "ANOVA",
    category: "Probability and Statistics"
  },
  {
    id: 1346,
    question: "Which test checks association between categorical variables?",
    options: ["Chi-square", "t-test", "ANOVA", "Z-test only"],
    answer: "Chi-square",
    category: "Probability and Statistics"
  },
  {
    id: 1347,
    question: "What is skewness?",
    options: ["Symmetry", "Asymmetry of a distribution", "Spread", "Center"],
    answer: "Asymmetry of a distribution",
    category: "Probability and Statistics"
  },
  {
    id: 1348,
    question: "What is kurtosis?",
    options: ["Skewness", "A measure of the 'tailedness' of a distribution", "Mode", "Median"],
    answer: "A measure of the 'tailedness' of a distribution",
    category: "Probability and Statistics"
  },
  {
    id: 1349,
    question: "What is the law of large numbers?",
    options: ["Sample mean approaches the true mean as sample size grows", "Mean equals mode always", "Variance is zero in large samples", "All distributions are normal"],
    answer: "Sample mean approaches the true mean as sample size grows",
    category: "Probability and Statistics"
  },
  {
    id: 1350,
    question: "What is descriptive statistics?",
    options: ["Predicting", "Summarizing and describing features of data (mean, SD, etc.)", "Making inferences", "Encrypting"],
    answer: "Summarizing and describing features of data (mean, SD, etc.)",
    category: "Probability and Statistics"
  },
  {
    id: 1351,
    question: "When did Pakistan gain independence?",
    options: ["August 14, 1947", "August 15, 1947", "March 23, 1940", "December 16, 1971"],
    answer: "August 14, 1947",
    category: "Pakistan Studies"
  },
  {
    id: 1352,
    question: "Who is the founder of Pakistan?",
    options: ["Allama Iqbal", "Quaid-e-Azam Muhammad Ali Jinnah", "Liaquat Ali Khan", "Sir Syed Ahmad Khan"],
    answer: "Quaid-e-Azam Muhammad Ali Jinnah",
    category: "Pakistan Studies"
  },
  {
    id: 1353,
    question: "Who proposed the idea of a separate Muslim state in his 1930 Allahabad address?",
    options: ["Sir Syed Ahmed Khan", "Allama Muhammad Iqbal", "Liaquat Ali Khan", "Choudhry Rahmat Ali"],
    answer: "Allama Muhammad Iqbal",
    category: "Pakistan Studies"
  },
  {
    id: 1354,
    question: "Who coined the name 'Pakistan'?",
    options: ["Allama Iqbal", "Quaid-e-Azam", "Choudhry Rahmat Ali", "Liaquat Ali Khan"],
    answer: "Choudhry Rahmat Ali",
    category: "Pakistan Studies"
  },
  {
    id: 1355,
    question: "When was the Lahore Resolution (Pakistan Resolution) passed?",
    options: ["March 23, 1940", "August 14, 1947", "March 23, 1956", "1930"],
    answer: "March 23, 1940",
    category: "Pakistan Studies"
  },
  {
    id: 1356,
    question: "Who was the first Prime Minister of Pakistan?",
    options: ["Liaquat Ali Khan", "Khawaja Nazimuddin", "Muhammad Ali Bogra", "Iskander Mirza"],
    answer: "Liaquat Ali Khan",
    category: "Pakistan Studies"
  },
  {
    id: 1357,
    question: "When did Pakistan become an Islamic Republic?",
    options: ["1956", "1947", "1962", "1973"],
    answer: "1956",
    category: "Pakistan Studies"
  },
  {
    id: 1358,
    question: "When was the current Constitution of Pakistan adopted?",
    options: ["1956", "1962", "1973", "1985"],
    answer: "1973",
    category: "Pakistan Studies"
  },
  {
    id: 1359,
    question: "What is the national language of Pakistan?",
    options: ["Punjabi", "Sindhi", "Urdu", "Pashto"],
    answer: "Urdu",
    category: "Pakistan Studies"
  },
  {
    id: 1360,
    question: "What is the capital of Pakistan?",
    options: ["Karachi", "Lahore", "Islamabad", "Peshawar"],
    answer: "Islamabad",
    category: "Pakistan Studies"
  },
  {
    id: 1361,
    question: "Which city was the first capital of Pakistan?",
    options: ["Karachi", "Lahore", "Islamabad", "Rawalpindi"],
    answer: "Karachi",
    category: "Pakistan Studies"
  },
  {
    id: 1362,
    question: "Which is the largest province of Pakistan by area?",
    options: ["Punjab", "Sindh", "Balochistan", "Khyber Pakhtunkhwa"],
    answer: "Balochistan",
    category: "Pakistan Studies"
  },
  {
    id: 1363,
    question: "Which is the most populous province of Pakistan?",
    options: ["Sindh", "Punjab", "Balochistan", "KPK"],
    answer: "Punjab",
    category: "Pakistan Studies"
  },
  {
    id: 1364,
    question: "What is the national animal of Pakistan?",
    options: ["Markhor", "Lion", "Tiger", "Camel"],
    answer: "Markhor",
    category: "Pakistan Studies"
  },
  {
    id: 1365,
    question: "What is the national bird of Pakistan?",
    options: ["Eagle", "Chukar Partridge", "Peacock", "Sparrow"],
    answer: "Chukar Partridge",
    category: "Pakistan Studies"
  },
  {
    id: 1366,
    question: "What is the national flower of Pakistan?",
    options: ["Rose", "Jasmine", "Tulip", "Sunflower"],
    answer: "Jasmine",
    category: "Pakistan Studies"
  },
  {
    id: 1367,
    question: "What is the national tree of Pakistan?",
    options: ["Deodar", "Banyan", "Mango", "Pine"],
    answer: "Deodar",
    category: "Pakistan Studies"
  },
  {
    id: 1368,
    question: "What is the national sport of Pakistan?",
    options: ["Cricket", "Hockey", "Football", "Squash"],
    answer: "Hockey",
    category: "Pakistan Studies"
  },
  {
    id: 1369,
    question: "Who wrote the national anthem of Pakistan?",
    options: ["Allama Iqbal", "Hafeez Jalandhari", "Faiz Ahmed Faiz", "Ahmad Faraz"],
    answer: "Hafeez Jalandhari",
    category: "Pakistan Studies"
  },
  {
    id: 1370,
    question: "Who composed the music of the Pakistani national anthem?",
    options: ["Ahmed Ghulamali Chagla", "Nusrat Fateh Ali Khan", "Mehdi Hassan", "Allama Iqbal"],
    answer: "Ahmed Ghulamali Chagla",
    category: "Pakistan Studies"
  },
  {
    id: 1371,
    question: "Which mountain is the second highest in the world, located in Pakistan?",
    options: ["Mount Everest", "K2", "Nanga Parbat", "Kanchenjunga"],
    answer: "K2",
    category: "Pakistan Studies"
  },
  {
    id: 1372,
    question: "Which river is the longest in Pakistan?",
    options: ["Ravi", "Chenab", "Indus", "Jhelum"],
    answer: "Indus",
    category: "Pakistan Studies"
  },
  {
    id: 1373,
    question: "Which year did East Pakistan become Bangladesh?",
    options: ["1947", "1971", "1965", "1973"],
    answer: "1971",
    category: "Pakistan Studies"
  },
  {
    id: 1374,
    question: "Who was the first President of Pakistan?",
    options: ["Iskander Mirza", "Ayub Khan", "Liaquat Ali Khan", "Ghulam Muhammad"],
    answer: "Iskander Mirza",
    category: "Pakistan Studies"
  },
  {
    id: 1375,
    question: "Who was Pakistan's first female Prime Minister?",
    options: ["Benazir Bhutto", "Fatima Jinnah", "Maryam Nawaz", "Asma Jahangir"],
    answer: "Benazir Bhutto",
    category: "Pakistan Studies"
  },
  {
    id: 1376,
    question: "When did Benazir Bhutto first become PM?",
    options: ["1985", "1988", "1993", "1996"],
    answer: "1988",
    category: "Pakistan Studies"
  },
  {
    id: 1377,
    question: "When did Pakistan conduct nuclear tests?",
    options: ["1971", "1998", "2001", "1965"],
    answer: "1998",
    category: "Pakistan Studies"
  },
  {
    id: 1378,
    question: "Who is regarded as the father of Pakistan's nuclear program?",
    options: ["Dr. Abdus Salam", "Dr. Abdul Qadeer Khan", "Dr. Atta-ur-Rahman", "Dr. Ishfaq Ahmad"],
    answer: "Dr. Abdul Qadeer Khan",
    category: "Pakistan Studies"
  },
  {
    id: 1379,
    question: "Which Pakistani won a Nobel Prize in Physics?",
    options: ["Dr. Abdul Qadeer Khan", "Dr. Abdus Salam", "Malala Yousafzai", "Dr. Atta-ur-Rahman"],
    answer: "Dr. Abdus Salam",
    category: "Pakistan Studies"
  },
  {
    id: 1380,
    question: "Which Pakistani won the Nobel Peace Prize?",
    options: ["Imran Khan", "Malala Yousafzai", "Edhi", "Quaid-e-Azam"],
    answer: "Malala Yousafzai",
    category: "Pakistan Studies"
  },
  {
    id: 1381,
    question: "What is CPEC?",
    options: ["A river", "China-Pakistan Economic Corridor", "A political party", "A national bank"],
    answer: "China-Pakistan Economic Corridor",
    category: "Pakistan Studies"
  },
  {
    id: 1382,
    question: "What is Pakistan's main export crop?",
    options: ["Wheat", "Cotton", "Rice", "Sugarcane"],
    answer: "Cotton",
    category: "Pakistan Studies"
  },
  {
    id: 1383,
    question: "Which is the deepest seaport of Pakistan?",
    options: ["Karachi", "Gwadar", "Port Qasim", "Pasni"],
    answer: "Gwadar",
    category: "Pakistan Studies"
  },
  {
    id: 1384,
    question: "When did the Indo-Pakistani war over Kashmir occur?",
    options: ["1948", "1965", "1971", "All of these"],
    answer: "All of these",
    category: "Pakistan Studies"
  },
  {
    id: 1385,
    question: "Which institution is Pakistan's central bank?",
    options: ["State Bank of Pakistan", "National Bank", "HBL", "MCB"],
    answer: "State Bank of Pakistan",
    category: "Pakistan Studies"
  },
  {
    id: 1386,
    question: "Which is Pakistan's currency?",
    options: ["Rupee", "Riyal", "Lira", "Dinar"],
    answer: "Rupee",
    category: "Pakistan Studies"
  },
  {
    id: 1387,
    question: "Which Mughal emperor built the Lahore Fort and Badshahi Mosque areas extensively?",
    options: ["Akbar", "Aurangzeb", "Shah Jahan", "Babur"],
    answer: "Aurangzeb",
    category: "Pakistan Studies"
  },
  {
    id: 1388,
    question: "Who founded the Aligarh Movement?",
    options: ["Allama Iqbal", "Sir Syed Ahmed Khan", "Quaid-e-Azam", "Liaquat Ali Khan"],
    answer: "Sir Syed Ahmed Khan",
    category: "Pakistan Studies"
  },
  {
    id: 1389,
    question: "When was All India Muslim League founded?",
    options: ["1885", "1906", "1916", "1940"],
    answer: "1906",
    category: "Pakistan Studies"
  },
  {
    id: 1390,
    question: "Where was the All India Muslim League founded?",
    options: ["Lahore", "Delhi", "Dhaka", "Aligarh"],
    answer: "Dhaka",
    category: "Pakistan Studies"
  },
  {
    id: 1391,
    question: "What was the Two-Nation Theory?",
    options: ["Hindus and Muslims are two distinct nations", "India and China are two nations", "British rule justification", "Two states only"],
    answer: "Hindus and Muslims are two distinct nations",
    category: "Pakistan Studies"
  },
  {
    id: 1392,
    question: "Who was the Governor-General of Pakistan after Quaid-e-Azam?",
    options: ["Khawaja Nazimuddin", "Liaquat Ali Khan", "Iskander Mirza", "Ghulam Muhammad"],
    answer: "Khawaja Nazimuddin",
    category: "Pakistan Studies"
  },
  {
    id: 1393,
    question: "Which year was the One Unit scheme introduced (West Pakistan)?",
    options: ["1947", "1955", "1962", "1971"],
    answer: "1955",
    category: "Pakistan Studies"
  },
  {
    id: 1394,
    question: "Which leader gave the famous 'Khutba' speech to constituent assembly on August 11, 1947?",
    options: ["Liaquat Ali Khan", "Quaid-e-Azam Muhammad Ali Jinnah", "Allama Iqbal", "Sir Syed"],
    answer: "Quaid-e-Azam Muhammad Ali Jinnah",
    category: "Pakistan Studies"
  },
  {
    id: 1395,
    question: "What is the Iqbal Day in Pakistan?",
    options: ["November 9", "December 25", "March 23", "August 14"],
    answer: "November 9",
    category: "Pakistan Studies"
  },
  {
    id: 1396,
    question: "What is celebrated on December 25 in Pakistan?",
    options: ["Independence Day", "Quaid-e-Azam's birthday", "Defence Day", "Pakistan Resolution Day"],
    answer: "Quaid-e-Azam's birthday",
    category: "Pakistan Studies"
  },
  {
    id: 1397,
    question: "When is Pakistan's Defence Day?",
    options: ["September 6", "August 14", "March 23", "December 16"],
    answer: "September 6",
    category: "Pakistan Studies"
  },
  {
    id: 1398,
    question: "What is the population approximate rank of Pakistan in the world?",
    options: ["Among the top 5 most populous", "Outside top 30", "Smallest country", "About 100th"],
    answer: "Among the top 5 most populous",
    category: "Pakistan Studies"
  },
  {
    id: 1399,
    question: "Which Pakistani city is called the 'City of Lights'?",
    options: ["Lahore", "Karachi", "Islamabad", "Peshawar"],
    answer: "Karachi",
    category: "Pakistan Studies"
  },
  {
    id: 1400,
    question: "Which Pakistani city is known as the 'Heart of Pakistan'?",
    options: ["Lahore", "Karachi", "Islamabad", "Multan"],
    answer: "Lahore",
    category: "Pakistan Studies"
  },
  {
    id: 1401,
    question: "How many pillars of Islam are there?",
    options: ["3", "4", "5", "6"],
    answer: "5",
    category: "Islamic Studies"
  },
  {
    id: 1402,
    question: "What is the first pillar of Islam?",
    options: ["Salah", "Shahada (declaration of faith)", "Zakat", "Hajj"],
    answer: "Shahada (declaration of faith)",
    category: "Islamic Studies"
  },
  {
    id: 1403,
    question: "How many times a day do Muslims pray (obligatory)?",
    options: ["3", "5", "7", "10"],
    answer: "5",
    category: "Islamic Studies"
  },
  {
    id: 1404,
    question: "What is Zakat?",
    options: ["Fasting", "Obligatory charity given annually on wealth", "Pilgrimage", "Daily prayer"],
    answer: "Obligatory charity given annually on wealth",
    category: "Islamic Studies"
  },
  {
    id: 1405,
    question: "What is Hajj?",
    options: ["Daily prayer", "Annual pilgrimage to Makkah", "Fasting", "Charity"],
    answer: "Annual pilgrimage to Makkah",
    category: "Islamic Studies"
  },
  {
    id: 1406,
    question: "In which month do Muslims fast?",
    options: ["Muharram", "Rajab", "Ramadan", "Shawwal"],
    answer: "Ramadan",
    category: "Islamic Studies"
  },
  {
    id: 1407,
    question: "How many articles of faith (Iman) are there?",
    options: ["3", "5", "6", "7"],
    answer: "6",
    category: "Islamic Studies"
  },
  {
    id: 1408,
    question: "Who was the last Prophet of Islam?",
    options: ["Prophet Isa (AS)", "Prophet Musa (AS)", "Prophet Muhammad (PBUH)", "Prophet Ibrahim (AS)"],
    answer: "Prophet Muhammad (PBUH)",
    category: "Islamic Studies"
  },
  {
    id: 1409,
    question: "In which city was Prophet Muhammad (PBUH) born?",
    options: ["Madinah", "Makkah", "Taif", "Damascus"],
    answer: "Makkah",
    category: "Islamic Studies"
  },
  {
    id: 1410,
    question: "What is the holy book of Islam?",
    options: ["Bible", "Torah", "Quran", "Vedas"],
    answer: "Quran",
    category: "Islamic Studies"
  },
  {
    id: 1411,
    question: "How many surahs are in the Quran?",
    options: ["100", "114", "120", "99"],
    answer: "114",
    category: "Islamic Studies"
  },
  {
    id: 1412,
    question: "What is the first Surah of the Quran?",
    options: ["Al-Baqarah", "Al-Fatihah", "Al-Ikhlas", "Yaseen"],
    answer: "Al-Fatihah",
    category: "Islamic Studies"
  },
  {
    id: 1413,
    question: "Which is the longest Surah in the Quran?",
    options: ["Al-Fatihah", "Al-Baqarah", "Yaseen", "Al-Kahf"],
    answer: "Al-Baqarah",
    category: "Islamic Studies"
  },
  {
    id: 1414,
    question: "Which is the shortest Surah?",
    options: ["Al-Kawthar", "Al-Asr", "Al-Ikhlas", "Al-Fatihah"],
    answer: "Al-Kawthar",
    category: "Islamic Studies"
  },
  {
    id: 1415,
    question: "What does 'Hadith' refer to?",
    options: ["Quranic verses", "Sayings and actions of the Prophet (PBUH)", "Stories of prophets", "Daily prayers"],
    answer: "Sayings and actions of the Prophet (PBUH)",
    category: "Islamic Studies"
  },
  {
    id: 1416,
    question: "Who is considered the first Caliph of Islam?",
    options: ["Umar (RA)", "Abu Bakr (RA)", "Uthman (RA)", "Ali (RA)"],
    answer: "Abu Bakr (RA)",
    category: "Islamic Studies"
  },
  {
    id: 1417,
    question: "How many Rashidun Caliphs were there?",
    options: ["3", "4", "5", "6"],
    answer: "4",
    category: "Islamic Studies"
  },
  {
    id: 1418,
    question: "Which Caliph was known as 'Al-Farooq'?",
    options: ["Abu Bakr (RA)", "Umar ibn al-Khattab (RA)", "Uthman (RA)", "Ali (RA)"],
    answer: "Umar ibn al-Khattab (RA)",
    category: "Islamic Studies"
  },
  {
    id: 1419,
    question: "What does 'Tawheed' mean?",
    options: ["Fasting", "Oneness of God", "Pilgrimage", "Daily prayer"],
    answer: "Oneness of God",
    category: "Islamic Studies"
  },
  {
    id: 1420,
    question: "What is the direction Muslims face for prayer called?",
    options: ["Mihrab", "Qibla", "Sajda", "Imam"],
    answer: "Qibla",
    category: "Islamic Studies"
  },
  {
    id: 1421,
    question: "Where is the Kaaba located?",
    options: ["Madinah", "Makkah", "Jerusalem", "Istanbul"],
    answer: "Makkah",
    category: "Islamic Studies"
  },
  {
    id: 1422,
    question: "What is the Hijra?",
    options: ["A daily prayer", "The Prophet's migration from Makkah to Madinah", "A type of charity", "A pilgrimage"],
    answer: "The Prophet's migration from Makkah to Madinah",
    category: "Islamic Studies"
  },
  {
    id: 1423,
    question: "In which year did Hijra occur (Gregorian)?",
    options: ["570 CE", "610 CE", "622 CE", "632 CE"],
    answer: "622 CE",
    category: "Islamic Studies"
  },
  {
    id: 1424,
    question: "Which event is celebrated on Eid-ul-Fitr?",
    options: ["End of Ramadan fasting", "Hajj completion", "Birth of Prophet", "Battle of Badr"],
    answer: "End of Ramadan fasting",
    category: "Islamic Studies"
  },
  {
    id: 1425,
    question: "Which event is celebrated on Eid-ul-Adha?",
    options: ["Migration", "Sacrifice (commemorating Ibrahim AS)", "Beginning of Ramadan", "Conquest of Makkah"],
    answer: "Sacrifice (commemorating Ibrahim AS)",
    category: "Islamic Studies"
  },
  {
    id: 1426,
    question: "What is the Islamic calendar based on?",
    options: ["Solar", "Lunar", "Both", "Stars"],
    answer: "Lunar",
    category: "Islamic Studies"
  },
  {
    id: 1427,
    question: "Who was the wife of the Prophet (PBUH) known as 'Mother of the Believers'?",
    options: ["Khadijah (RA)", "Aisha (RA)", "Hafsa (RA)", "All of them"],
    answer: "All of them",
    category: "Islamic Studies"
  },
  {
    id: 1428,
    question: "Who was the first wife of the Prophet (PBUH)?",
    options: ["Aisha (RA)", "Khadijah (RA)", "Hafsa (RA)", "Maymunah (RA)"],
    answer: "Khadijah (RA)",
    category: "Islamic Studies"
  },
  {
    id: 1429,
    question: "What is the term for a person who memorizes the Quran?",
    options: ["Imam", "Hafiz", "Mufti", "Qari"],
    answer: "Hafiz",
    category: "Islamic Studies"
  },
  {
    id: 1430,
    question: "What is the language of the Quran?",
    options: ["Persian", "Arabic", "Urdu", "Hebrew"],
    answer: "Arabic",
    category: "Islamic Studies"
  },
  {
    id: 1431,
    question: "What is 'Sawm'?",
    options: ["Charity", "Fasting", "Pilgrimage", "Prayer"],
    answer: "Fasting",
    category: "Islamic Studies"
  },
  {
    id: 1432,
    question: "How many Rakahs are in Fajr prayer (obligatory)?",
    options: ["2", "3", "4", "5"],
    answer: "2",
    category: "Islamic Studies"
  },
  {
    id: 1433,
    question: "Which prayer has 4 Rakahs (obligatory) at midday?",
    options: ["Fajr", "Zuhr", "Maghrib", "Isha"],
    answer: "Zuhr",
    category: "Islamic Studies"
  },
  {
    id: 1434,
    question: "Which prayer has 3 Rakahs (obligatory)?",
    options: ["Fajr", "Maghrib", "Isha", "Asr"],
    answer: "Maghrib",
    category: "Islamic Studies"
  },
  {
    id: 1435,
    question: "What is 'Sunnah'?",
    options: ["A pillar", "Practices and traditions of the Prophet (PBUH)", "A daily prayer", "Hajj"],
    answer: "Practices and traditions of the Prophet (PBUH)",
    category: "Islamic Studies"
  },
  {
    id: 1436,
    question: "Which battle is known as 'Furqan'?",
    options: ["Battle of Uhud", "Battle of Badr", "Battle of Khandaq", "Battle of Khaybar"],
    answer: "Battle of Badr",
    category: "Islamic Studies"
  },
  {
    id: 1437,
    question: "When was the Battle of Badr fought?",
    options: ["2 AH", "3 AH", "5 AH", "8 AH"],
    answer: "2 AH",
    category: "Islamic Studies"
  },
  {
    id: 1438,
    question: "What is 'Jannah'?",
    options: ["Hell", "Paradise", "World", "Grave"],
    answer: "Paradise",
    category: "Islamic Studies"
  },
  {
    id: 1439,
    question: "What is 'Jahannam'?",
    options: ["Heaven", "Hell", "Earth", "Sky"],
    answer: "Hell",
    category: "Islamic Studies"
  },
  {
    id: 1440,
    question: "What is the Night of Power called?",
    options: ["Laylat al-Qadr", "Laylat al-Israʼ", "Laylat al-Bara'ah", "Laylat al-Mubarak"],
    answer: "Laylat al-Qadr",
    category: "Islamic Studies"
  },
  {
    id: 1441,
    question: "How many Surahs were revealed in Makkah?",
    options: ["28", "86", "114", "100"],
    answer: "86",
    category: "Islamic Studies"
  },
  {
    id: 1442,
    question: "Surahs revealed in Madinah are called:",
    options: ["Makki", "Madani", "Quraishi", "Hijazi"],
    answer: "Madani",
    category: "Islamic Studies"
  },
  {
    id: 1443,
    question: "The Quran was revealed over a period of approximately:",
    options: ["10 years", "13 years", "23 years", "30 years"],
    answer: "23 years",
    category: "Islamic Studies"
  },
  {
    id: 1444,
    question: "Who compiled the Quran in book form?",
    options: ["Abu Bakr (RA)", "Umar (RA)", "Uthman (RA)", "Ali (RA)"],
    answer: "Abu Bakr (RA)",
    category: "Islamic Studies"
  },
  {
    id: 1445,
    question: "Who standardized one official version of the Quran?",
    options: ["Abu Bakr (RA)", "Umar (RA)", "Uthman (RA)", "Ali (RA)"],
    answer: "Uthman (RA)",
    category: "Islamic Studies"
  },
  {
    id: 1446,
    question: "What does 'Halal' mean?",
    options: ["Forbidden", "Permitted", "Optional", "Required"],
    answer: "Permitted",
    category: "Islamic Studies"
  },
  {
    id: 1447,
    question: "What does 'Haram' mean?",
    options: ["Permitted", "Forbidden", "Recommended", "Optional"],
    answer: "Forbidden",
    category: "Islamic Studies"
  },
  {
    id: 1448,
    question: "What is 'Sadaqah'?",
    options: ["Obligatory charity", "Voluntary charity", "Forbidden", "Tax"],
    answer: "Voluntary charity",
    category: "Islamic Studies"
  },
  {
    id: 1449,
    question: "Who was the first man to accept Islam?",
    options: ["Abu Bakr (RA)", "Umar (RA)", "Ali (RA)", "Uthman (RA)"],
    answer: "Abu Bakr (RA)",
    category: "Islamic Studies"
  },
  {
    id: 1450,
    question: "Who was the first child to accept Islam?",
    options: ["Hasan (RA)", "Ali ibn Abi Talib (RA)", "Husayn (RA)", "Zayd (RA)"],
    answer: "Ali ibn Abi Talib (RA)",
    category: "Islamic Studies"
  },
  {
    id: 1451,
    question: "What is economics?",
    options: ["The study of money only", "The study of how societies allocate scarce resources to satisfy unlimited wants", "Banking", "Accounting"],
    answer: "The study of how societies allocate scarce resources to satisfy unlimited wants",
    category: "Economics"
  },
  {
    id: 1452,
    question: "Microeconomics studies:",
    options: ["Whole economy", "Individual consumers, firms, and markets", "Government policy only", "International trade only"],
    answer: "Individual consumers, firms, and markets",
    category: "Economics"
  },
  {
    id: 1453,
    question: "Macroeconomics studies:",
    options: ["Single firms only", "The economy as a whole — GDP, inflation, unemployment", "Individual prices only", "Households only"],
    answer: "The economy as a whole — GDP, inflation, unemployment",
    category: "Economics"
  },
  {
    id: 1454,
    question: "What is scarcity?",
    options: ["Plenty of resources", "Limited resources relative to unlimited wants", "Wealth", "Surplus"],
    answer: "Limited resources relative to unlimited wants",
    category: "Economics"
  },
  {
    id: 1455,
    question: "What is opportunity cost?",
    options: ["The cost of an opportunity", "The value of the next best alternative foregone", "Total cost", "Revenue"],
    answer: "The value of the next best alternative foregone",
    category: "Economics"
  },
  {
    id: 1456,
    question: "What does the law of demand state?",
    options: ["Price up, demand up", "As price decreases, quantity demanded increases (ceteris paribus)", "Price has no effect", "Demand is always constant"],
    answer: "As price decreases, quantity demanded increases (ceteris paribus)",
    category: "Economics"
  },
  {
    id: 1457,
    question: "What does the law of supply state?",
    options: ["Price up, supply down", "As price rises, quantity supplied rises (ceteris paribus)", "Supply is constant", "Price has no effect"],
    answer: "As price rises, quantity supplied rises (ceteris paribus)",
    category: "Economics"
  },
  {
    id: 1458,
    question: "Equilibrium price occurs when:",
    options: ["Demand exceeds supply", "Quantity demanded equals quantity supplied", "Supply exceeds demand", "There's surplus"],
    answer: "Quantity demanded equals quantity supplied",
    category: "Economics"
  },
  {
    id: 1459,
    question: "What is a market?",
    options: ["A grocery store only", "A place or system where buyers and sellers exchange goods/services", "A factory only", "Just online"],
    answer: "A place or system where buyers and sellers exchange goods/services",
    category: "Economics"
  },
  {
    id: 1460,
    question: "What does GDP stand for?",
    options: ["Gross Domestic Product", "General Demand Price", "Gross Demand Price", "Global Distribution Plan"],
    answer: "Gross Domestic Product",
    category: "Economics"
  },
  {
    id: 1461,
    question: "What is GDP?",
    options: ["Total wealth", "The total monetary value of all goods/services produced in a country in a period", "Total exports", "Government spending"],
    answer: "The total monetary value of all goods/services produced in a country in a period",
    category: "Economics"
  },
  {
    id: 1462,
    question: "What is inflation?",
    options: ["Decrease in prices", "A general rise in prices over time", "Stable prices", "Government tax"],
    answer: "A general rise in prices over time",
    category: "Economics"
  },
  {
    id: 1463,
    question: "What is deflation?",
    options: ["Increase in prices", "A general decrease in prices", "High inflation", "Hyperinflation"],
    answer: "A general decrease in prices",
    category: "Economics"
  },
  {
    id: 1464,
    question: "What is unemployment rate?",
    options: ["Percentage of labor force without work but seeking it", "Percentage of employed", "GDP", "Total population"],
    answer: "Percentage of labor force without work but seeking it",
    category: "Economics"
  },
  {
    id: 1465,
    question: "What are the four factors of production?",
    options: ["Land, Labor, Capital, Entrepreneurship", "Money, Time, Effort, Skill", "Goods, Services, Money, Labor", "Tax, Income, Expenditure, Savings"],
    answer: "Land, Labor, Capital, Entrepreneurship",
    category: "Economics"
  },
  {
    id: 1466,
    question: "What is a monopoly?",
    options: ["Many sellers", "A single seller controlling the market", "Two sellers", "Fair market"],
    answer: "A single seller controlling the market",
    category: "Economics"
  },
  {
    id: 1467,
    question: "What is an oligopoly?",
    options: ["Single seller", "Few large firms dominating a market", "Many small firms", "No competition"],
    answer: "Few large firms dominating a market",
    category: "Economics"
  },
  {
    id: 1468,
    question: "What is perfect competition?",
    options: ["One seller", "Many buyers and sellers, identical products, free entry/exit", "A monopoly", "Restricted markets"],
    answer: "Many buyers and sellers, identical products, free entry/exit",
    category: "Economics"
  },
  {
    id: 1469,
    question: "What is fiscal policy?",
    options: ["Taxes and government spending decisions", "Interest rate setting", "Trade policy only", "Banking only"],
    answer: "Taxes and government spending decisions",
    category: "Economics"
  },
  {
    id: 1470,
    question: "What is monetary policy?",
    options: ["Setting taxes", "Central bank actions controlling money supply and interest rates", "Government spending", "Trade barriers"],
    answer: "Central bank actions controlling money supply and interest rates",
    category: "Economics"
  },
  {
    id: 1471,
    question: "What does CPI stand for?",
    options: ["Consumer Price Index", "Central Pricing Indicator", "Combined Production Index", "Currency Price Index"],
    answer: "Consumer Price Index",
    category: "Economics"
  },
  {
    id: 1472,
    question: "What is elasticity of demand?",
    options: ["Stretchy materials", "Responsiveness of quantity demanded to a change in price", "Total demand", "Price level"],
    answer: "Responsiveness of quantity demanded to a change in price",
    category: "Economics"
  },
  {
    id: 1473,
    question: "If demand is inelastic, then:",
    options: ["Quantity changes a lot with price", "Quantity barely changes with price", "Demand is zero", "Price is zero"],
    answer: "Quantity barely changes with price",
    category: "Economics"
  },
  {
    id: 1474,
    question: "What is a complementary good?",
    options: ["Substitute", "A good consumed with another (e.g., bread and butter)", "An unrelated good", "Free good"],
    answer: "A good consumed with another (e.g., bread and butter)",
    category: "Economics"
  },
  {
    id: 1475,
    question: "What is a substitute good?",
    options: ["Used together", "A good that can replace another (e.g., tea and coffee)", "Free good", "Complement"],
    answer: "A good that can replace another (e.g., tea and coffee)",
    category: "Economics"
  },
  {
    id: 1476,
    question: "What is a normal good?",
    options: ["Demand falls as income rises", "Demand rises as income rises", "Inferior good", "Free good"],
    answer: "Demand rises as income rises",
    category: "Economics"
  },
  {
    id: 1477,
    question: "What is an inferior good?",
    options: ["Demand falls as income rises", "Always premium", "Free good", "Substitute"],
    answer: "Demand falls as income rises",
    category: "Economics"
  },
  {
    id: 1478,
    question: "What is a public good?",
    options: ["A government building", "A non-rivalrous, non-excludable good (e.g., national defense)", "A private car", "A subscription service"],
    answer: "A non-rivalrous, non-excludable good (e.g., national defense)",
    category: "Economics"
  },
  {
    id: 1479,
    question: "What is an externality?",
    options: ["Foreign trade", "A side effect of an economic activity affecting third parties (e.g., pollution)", "A tariff", "An import tax"],
    answer: "A side effect of an economic activity affecting third parties (e.g., pollution)",
    category: "Economics"
  },
  {
    id: 1480,
    question: "What is a tariff?",
    options: ["A subsidy", "A tax on imported goods", "A type of profit", "A discount"],
    answer: "A tax on imported goods",
    category: "Economics"
  },
  {
    id: 1481,
    question: "What is a subsidy?",
    options: ["A tax", "Government payment to support a business or industry", "A loan", "A penalty"],
    answer: "Government payment to support a business or industry",
    category: "Economics"
  },
  {
    id: 1482,
    question: "What is comparative advantage?",
    options: ["Producing all goods at lower cost", "Producing a good at lower opportunity cost than another producer", "Total cost advantage", "Higher prices"],
    answer: "Producing a good at lower opportunity cost than another producer",
    category: "Economics"
  },
  {
    id: 1483,
    question: "Who proposed the theory of comparative advantage?",
    options: ["Adam Smith", "David Ricardo", "Karl Marx", "John Keynes"],
    answer: "David Ricardo",
    category: "Economics"
  },
  {
    id: 1484,
    question: "Who is considered the father of economics?",
    options: ["Adam Smith", "David Ricardo", "Karl Marx", "John Keynes"],
    answer: "Adam Smith",
    category: "Economics"
  },
  {
    id: 1485,
    question: "What is Adam Smith's most famous book?",
    options: ["Das Kapital", "The Wealth of Nations", "General Theory", "Principles of Political Economy"],
    answer: "The Wealth of Nations",
    category: "Economics"
  },
  {
    id: 1486,
    question: "What is the 'invisible hand'?",
    options: ["A magic trick", "Adam Smith's metaphor for how self-interest in markets leads to social benefit", "A government policy", "A tax"],
    answer: "Adam Smith's metaphor for how self-interest in markets leads to social benefit",
    category: "Economics"
  },
  {
    id: 1487,
    question: "What is recession?",
    options: ["Growing economy", "A significant decline in economic activity for two or more consecutive quarters", "Boom", "Inflation"],
    answer: "A significant decline in economic activity for two or more consecutive quarters",
    category: "Economics"
  },
  {
    id: 1488,
    question: "What is fiscal deficit?",
    options: ["Surplus", "Excess of government spending over revenue", "Tax cut", "Saving"],
    answer: "Excess of government spending over revenue",
    category: "Economics"
  },
  {
    id: 1489,
    question: "What is the function of money?",
    options: ["Decoration", "Medium of exchange, unit of account, store of value", "Currency only", "Loan"],
    answer: "Medium of exchange, unit of account, store of value",
    category: "Economics"
  },
  {
    id: 1490,
    question: "What is barter?",
    options: ["Using money", "Direct exchange of goods/services without money", "A tax", "An auction"],
    answer: "Direct exchange of goods/services without money",
    category: "Economics"
  },
  {
    id: 1491,
    question: "What is GNP?",
    options: ["Gross National Product — output by a country's residents domestically and abroad", "Same as GDP", "Net imports", "Government spending"],
    answer: "Gross National Product — output by a country's residents domestically and abroad",
    category: "Economics"
  },
  {
    id: 1492,
    question: "What is per capita income?",
    options: ["Total GDP", "GDP divided by population", "Tax revenue", "Investment"],
    answer: "GDP divided by population",
    category: "Economics"
  },
  {
    id: 1493,
    question: "What is a budget surplus?",
    options: ["Spending more than revenue", "Revenue exceeds spending", "Equal spending and revenue", "Zero revenue"],
    answer: "Revenue exceeds spending",
    category: "Economics"
  },
  {
    id: 1494,
    question: "What does 'ceteris paribus' mean?",
    options: ["All things changing", "Other things being equal (held constant)", "A type of tax", "A free market"],
    answer: "Other things being equal (held constant)",
    category: "Economics"
  },
  {
    id: 1495,
    question: "What is consumer surplus?",
    options: ["The difference between what consumers pay and what they were willing to pay", "Unsold inventory", "Profit", "Wage"],
    answer: "The difference between what consumers pay and what they were willing to pay",
    category: "Economics"
  },
  {
    id: 1496,
    question: "What is producer surplus?",
    options: ["Profit", "The difference between the price received and the minimum producer was willing to accept", "Total revenue", "Cost"],
    answer: "The difference between the price received and the minimum producer was willing to accept",
    category: "Economics"
  },
  {
    id: 1497,
    question: "What is a free market economy?",
    options: ["Government runs everything", "Decisions made by individuals/firms with limited government intervention", "All free goods", "Centralized planning"],
    answer: "Decisions made by individuals/firms with limited government intervention",
    category: "Economics"
  },
  {
    id: 1498,
    question: "What is a command economy?",
    options: ["Free market", "Government controls production and distribution decisions", "Mixed economy", "Capitalism"],
    answer: "Government controls production and distribution decisions",
    category: "Economics"
  },
  {
    id: 1499,
    question: "What is a mixed economy?",
    options: ["Pure capitalism", "Combination of private enterprise and government intervention", "Pure communism", "Barter"],
    answer: "Combination of private enterprise and government intervention",
    category: "Economics"
  },
  {
    id: 1500,
    question: "What is supply chain?",
    options: ["A tax network", "The network of producers, distributors, and retailers that bring products to consumers", "Banking system", "Communication system"],
    answer: "The network of producers, distributors, and retailers that bring products to consumers",
    category: "Economics"
  },
  {
    id: 1501,
    question: "Which is a noun?",
    options: ["Run", "Quickly", "Book", "Beautiful"],
    answer: "Book",
    category: "English Language Skills"
  },
  {
    id: 1502,
    question: "Which is a verb?",
    options: ["Happy", "Run", "Tall", "Quickly"],
    answer: "Run",
    category: "English Language Skills"
  },
  {
    id: 1503,
    question: "Which is an adjective?",
    options: ["Quickly", "Beautiful", "Run", "House"],
    answer: "Beautiful",
    category: "English Language Skills"
  },
  {
    id: 1504,
    question: "Which is an adverb?",
    options: ["Quickly", "House", "Tall", "Run"],
    answer: "Quickly",
    category: "English Language Skills"
  },
  {
    id: 1505,
    question: "Which is a pronoun?",
    options: ["She", "Run", "Tall", "Beautiful"],
    answer: "She",
    category: "English Language Skills"
  },
  {
    id: 1506,
    question: "Which sentence is in the present tense?",
    options: ["She ate dinner.", "She eats dinner.", "She will eat dinner.", "She had eaten dinner."],
    answer: "She eats dinner.",
    category: "English Language Skills"
  },
  {
    id: 1507,
    question: "Which sentence is in the past tense?",
    options: ["She walks home.", "She walked home.", "She will walk home.", "She is walking home."],
    answer: "She walked home.",
    category: "English Language Skills"
  },
  {
    id: 1508,
    question: "Which sentence is in the future tense?",
    options: ["He plays.", "He played.", "He will play.", "He is playing."],
    answer: "He will play.",
    category: "English Language Skills"
  },
  {
    id: 1509,
    question: "What is the plural of 'child'?",
    options: ["Childs", "Childrens", "Children", "Childes"],
    answer: "Children",
    category: "English Language Skills"
  },
  {
    id: 1510,
    question: "What is the plural of 'mouse' (animal)?",
    options: ["Mouses", "Mice", "Mices", "Mouse"],
    answer: "Mice",
    category: "English Language Skills"
  },
  {
    id: 1511,
    question: "Which is correct?",
    options: ["He don't like it.", "He doesn't like it.", "He didn't likes it.", "He no likes it."],
    answer: "He doesn't like it.",
    category: "English Language Skills"
  },
  {
    id: 1512,
    question: "Choose the correct article: '___ apple a day keeps the doctor away.'",
    options: ["A", "An", "The", "No article"],
    answer: "An",
    category: "English Language Skills"
  },
  {
    id: 1513,
    question: "Choose the correct preposition: 'She is good ___ math.'",
    options: ["in", "at", "on", "with"],
    answer: "at",
    category: "English Language Skills"
  },
  {
    id: 1514,
    question: "Synonym of 'happy':",
    options: ["Sad", "Angry", "Joyful", "Tired"],
    answer: "Joyful",
    category: "English Language Skills"
  },
  {
    id: 1515,
    question: "Antonym of 'big':",
    options: ["Large", "Huge", "Small", "Tall"],
    answer: "Small",
    category: "English Language Skills"
  },
  {
    id: 1516,
    question: "Which is a complete sentence?",
    options: ["Running fast.", "Because it rained.", "She runs fast.", "On the table."],
    answer: "She runs fast.",
    category: "English Language Skills"
  },
  {
    id: 1517,
    question: "What punctuation ends a question?",
    options: ["Period (.)", "Comma (,)", "Question mark (?)", "Exclamation (!)"],
    answer: "Question mark (?)",
    category: "English Language Skills"
  },
  {
    id: 1518,
    question: "What is a paragraph?",
    options: ["A single word", "A group of related sentences focused on one idea", "A sentence", "A title"],
    answer: "A group of related sentences focused on one idea",
    category: "English Language Skills"
  },
  {
    id: 1519,
    question: "What is the topic sentence?",
    options: ["The last sentence", "The sentence stating the main idea of a paragraph", "Any sentence", "Just a title"],
    answer: "The sentence stating the main idea of a paragraph",
    category: "English Language Skills"
  },
  {
    id: 1520,
    question: "Which is an example of a simile?",
    options: ["He is a lion.", "He is as brave as a lion.", "He roared loudly.", "He runs."],
    answer: "He is as brave as a lion.",
    category: "English Language Skills"
  },
  {
    id: 1521,
    question: "Which is a metaphor?",
    options: ["She is like a star.", "She is a star.", "She is bright.", "She is tired."],
    answer: "She is a star.",
    category: "English Language Skills"
  },
  {
    id: 1522,
    question: "What is alliteration?",
    options: ["Rhyming", "Repetition of initial consonant sounds (e.g., 'Peter Piper')", "Stating the obvious", "Question form"],
    answer: "Repetition of initial consonant sounds (e.g., 'Peter Piper')",
    category: "English Language Skills"
  },
  {
    id: 1523,
    question: "What is personification?",
    options: ["Giving human qualities to non-human things", "A type of pronoun", "A metaphor only", "A rhyme"],
    answer: "Giving human qualities to non-human things",
    category: "English Language Skills"
  },
  {
    id: 1524,
    question: "Which sentence uses passive voice?",
    options: ["She wrote the letter.", "The letter was written by her.", "She is writing.", "Write the letter."],
    answer: "The letter was written by her.",
    category: "English Language Skills"
  },
  {
    id: 1525,
    question: "Which sentence uses active voice?",
    options: ["The cake was eaten by Tom.", "Tom ate the cake.", "Cake was being baked.", "It is eaten."],
    answer: "Tom ate the cake.",
    category: "English Language Skills"
  },
  {
    id: 1526,
    question: "Choose the correct word: 'Their/There/They're going home.'",
    options: ["Their", "There", "They're", "Theirs"],
    answer: "They're",
    category: "English Language Skills"
  },
  {
    id: 1527,
    question: "Which means 'belonging to them'?",
    options: ["There", "Their", "They're", "Theirs"],
    answer: "Their",
    category: "English Language Skills"
  },
  {
    id: 1528,
    question: "'Its' vs 'It's' — which is the contraction of 'it is'?",
    options: ["Its", "It's", "Both", "Neither"],
    answer: "It's",
    category: "English Language Skills"
  },
  {
    id: 1529,
    question: "What is a conjunction?",
    options: ["A word joining clauses or words (e.g., and, but, or)", "A type of noun", "A verb tense", "A punctuation"],
    answer: "A word joining clauses or words (e.g., and, but, or)",
    category: "English Language Skills"
  },
  {
    id: 1530,
    question: "Which is a coordinating conjunction?",
    options: ["Although", "Because", "And", "When"],
    answer: "And",
    category: "English Language Skills"
  },
  {
    id: 1531,
    question: "What is a subordinating conjunction?",
    options: ["And", "Although", "But", "Or"],
    answer: "Although",
    category: "English Language Skills"
  },
  {
    id: 1532,
    question: "Which is correctly capitalized?",
    options: ["i live in karachi.", "I live in karachi.", "I live in Karachi.", "i live in Karachi."],
    answer: "I live in Karachi.",
    category: "English Language Skills"
  },
  {
    id: 1533,
    question: "What does 'ubiquitous' mean?",
    options: ["Rare", "Found everywhere", "Beautiful", "Dangerous"],
    answer: "Found everywhere",
    category: "English Language Skills"
  },
  {
    id: 1534,
    question: "What does 'concise' mean?",
    options: ["Long-winded", "Brief and clear", "Confusing", "Loud"],
    answer: "Brief and clear",
    category: "English Language Skills"
  },
  {
    id: 1535,
    question: "What is the past tense of 'go'?",
    options: ["Goed", "Went", "Gone", "Going"],
    answer: "Went",
    category: "English Language Skills"
  },
  {
    id: 1536,
    question: "What is the past participle of 'eat'?",
    options: ["Ate", "Eaten", "Eating", "Eats"],
    answer: "Eaten",
    category: "English Language Skills"
  },
  {
    id: 1537,
    question: "Identify the subject: 'The cat sat on the mat.'",
    options: ["sat", "The cat", "the mat", "on"],
    answer: "The cat",
    category: "English Language Skills"
  },
  {
    id: 1538,
    question: "Identify the object: 'She read the book.'",
    options: ["She", "read", "the book", "the"],
    answer: "the book",
    category: "English Language Skills"
  },
  {
    id: 1539,
    question: "What is a clause?",
    options: ["A type of fruit", "A group of words containing a subject and a verb", "A single word", "A punctuation"],
    answer: "A group of words containing a subject and a verb",
    category: "English Language Skills"
  },
  {
    id: 1540,
    question: "What is a phrase?",
    options: ["A complete sentence", "A group of words without a subject-verb combination", "A single word", "A clause"],
    answer: "A group of words without a subject-verb combination",
    category: "English Language Skills"
  },
  {
    id: 1541,
    question: "What is a homophone?",
    options: ["Two words spelled the same", "Two words sounding alike but with different meanings (e.g., 'flour'/'flower')", "Two synonyms", "An antonym"],
    answer: "Two words sounding alike but with different meanings (e.g., 'flour'/'flower')",
    category: "English Language Skills"
  },
  {
    id: 1542,
    question: "What is the antonym of 'ancient'?",
    options: ["Old", "Modern", "Historic", "Past"],
    answer: "Modern",
    category: "English Language Skills"
  },
  {
    id: 1543,
    question: "Which is a formal sentence?",
    options: ["Hey, what's up?", "I would like to inquire about your services.", "Yo!", "Lemme know."],
    answer: "I would like to inquire about your services.",
    category: "English Language Skills"
  },
  {
    id: 1544,
    question: "Which is an informal greeting?",
    options: ["Good morning, sir.", "Dear Madam,", "Hi!", "To whom it may concern,"],
    answer: "Hi!",
    category: "English Language Skills"
  },
  {
    id: 1545,
    question: "What is an idiom?",
    options: ["A literal phrase", "An expression whose meaning differs from literal interpretation (e.g., 'kick the bucket')", "A noun", "A verb"],
    answer: "An expression whose meaning differs from literal interpretation (e.g., 'kick the bucket')",
    category: "English Language Skills"
  },
  {
    id: 1546,
    question: "What does 'piece of cake' mean?",
    options: ["A dessert", "Something very easy", "Something difficult", "A literal cake"],
    answer: "Something very easy",
    category: "English Language Skills"
  },
  {
    id: 1547,
    question: "Which sentence is grammatically correct?",
    options: ["Me and her went home.", "Her and I went home.", "She and I went home.", "She and me went home."],
    answer: "She and I went home.",
    category: "English Language Skills"
  },
  {
    id: 1548,
    question: "What is a thesis statement?",
    options: ["A title", "The main argument or claim of an essay, usually in the introduction", "Conclusion", "A topic sentence only"],
    answer: "The main argument or claim of an essay, usually in the introduction",
    category: "English Language Skills"
  },
  {
    id: 1549,
    question: "What is paraphrasing?",
    options: ["Copying word-for-word", "Restating someone else's idea in your own words", "Quoting", "Summarizing in one word"],
    answer: "Restating someone else's idea in your own words",
    category: "English Language Skills"
  },
  {
    id: 1550,
    question: "What is plagiarism?",
    options: ["Citing sources properly", "Using someone else's work or ideas without giving credit", "Paraphrasing", "Writing original work"],
    answer: "Using someone else's work or ideas without giving credit",
    category: "English Language Skills"
  },
  {
    id: 1551,
    question: "What is psychology?",
    options: ["The study of stars", "The scientific study of mind and behavior", "Politics", "Chemistry"],
    answer: "The scientific study of mind and behavior",
    category: "Psychology-I"
  },
  {
    id: 1552,
    question: "Who is considered the father of psychology?",
    options: ["Sigmund Freud", "Wilhelm Wundt", "B.F. Skinner", "Carl Jung"],
    answer: "Wilhelm Wundt",
    category: "Psychology-I"
  },
  {
    id: 1553,
    question: "Who founded psychoanalysis?",
    options: ["Wundt", "Skinner", "Freud", "Watson"],
    answer: "Freud",
    category: "Psychology-I"
  },
  {
    id: 1554,
    question: "Who is associated with classical conditioning?",
    options: ["Skinner", "Freud", "Pavlov", "Maslow"],
    answer: "Pavlov",
    category: "Psychology-I"
  },
  {
    id: 1555,
    question: "Who is associated with operant conditioning?",
    options: ["Pavlov", "B.F. Skinner", "Freud", "Bandura"],
    answer: "B.F. Skinner",
    category: "Psychology-I"
  },
  {
    id: 1556,
    question: "Who proposed the hierarchy of needs?",
    options: ["Skinner", "Maslow", "Freud", "Jung"],
    answer: "Maslow",
    category: "Psychology-I"
  },
  {
    id: 1557,
    question: "What is at the top of Maslow's hierarchy?",
    options: ["Safety", "Belonging", "Self-actualization", "Physiological needs"],
    answer: "Self-actualization",
    category: "Psychology-I"
  },
  {
    id: 1558,
    question: "What is at the base of Maslow's hierarchy?",
    options: ["Esteem", "Physiological needs (food, water, sleep)", "Self-actualization", "Belonging"],
    answer: "Physiological needs (food, water, sleep)",
    category: "Psychology-I"
  },
  {
    id: 1559,
    question: "Who developed the theory of cognitive development in children?",
    options: ["Piaget", "Freud", "Skinner", "Erikson"],
    answer: "Piaget",
    category: "Psychology-I"
  },
  {
    id: 1560,
    question: "How many stages did Piaget propose?",
    options: ["3", "4", "5", "8"],
    answer: "4",
    category: "Psychology-I"
  },
  {
    id: 1561,
    question: "Who developed the eight stages of psychosocial development?",
    options: ["Piaget", "Erikson", "Freud", "Watson"],
    answer: "Erikson",
    category: "Psychology-I"
  },
  {
    id: 1562,
    question: "Which of the following is NOT a major perspective in psychology?",
    options: ["Behavioral", "Cognitive", "Astronomical", "Humanistic"],
    answer: "Astronomical",
    category: "Psychology-I"
  },
  {
    id: 1563,
    question: "What does the cognitive perspective focus on?",
    options: ["Unconscious mind", "Mental processes like thinking, memory", "Only behavior", "Genetics"],
    answer: "Mental processes like thinking, memory",
    category: "Psychology-I"
  },
  {
    id: 1564,
    question: "What does the behaviorist perspective focus on?",
    options: ["Observable behavior", "Unconscious thoughts", "Only emotions", "Genetics"],
    answer: "Observable behavior",
    category: "Psychology-I"
  },
  {
    id: 1565,
    question: "What is short-term memory's typical capacity?",
    options: ["1 item", "5 items", "About 7 (±2) items", "100 items"],
    answer: "About 7 (±2) items",
    category: "Psychology-I"
  },
  {
    id: 1566,
    question: "What is long-term memory?",
    options: ["A few seconds of memory", "Memory that can store information for long periods, possibly indefinitely", "Sensory memory", "Working memory only"],
    answer: "Memory that can store information for long periods, possibly indefinitely",
    category: "Psychology-I"
  },
  {
    id: 1567,
    question: "What is conditioning?",
    options: ["Hair care", "A form of learning by association", "A diagnostic test", "A genetic process"],
    answer: "A form of learning by association",
    category: "Psychology-I"
  },
  {
    id: 1568,
    question: "Which is an example of classical conditioning?",
    options: ["Pavlov's dog salivating at a bell", "Pressing a lever for food", "Reading a book", "Solving math"],
    answer: "Pavlov's dog salivating at a bell",
    category: "Psychology-I"
  },
  {
    id: 1569,
    question: "Which is an example of operant conditioning?",
    options: ["Salivating at a bell", "A rat pressing a lever to get food", "Reflex", "Innate fear"],
    answer: "A rat pressing a lever to get food",
    category: "Psychology-I"
  },
  {
    id: 1570,
    question: "What is reinforcement?",
    options: ["Punishment", "A consequence that increases the likelihood of a behavior", "A neutral event", "A reflex"],
    answer: "A consequence that increases the likelihood of a behavior",
    category: "Psychology-I"
  },
  {
    id: 1571,
    question: "Positive reinforcement involves:",
    options: ["Removing a stimulus", "Adding a pleasant stimulus to increase a behavior", "Punishment", "Extinction"],
    answer: "Adding a pleasant stimulus to increase a behavior",
    category: "Psychology-I"
  },
  {
    id: 1572,
    question: "Negative reinforcement involves:",
    options: ["Adding a pleasant stimulus", "Removing an unpleasant stimulus to increase a behavior", "Punishment", "Extinction"],
    answer: "Removing an unpleasant stimulus to increase a behavior",
    category: "Psychology-I"
  },
  {
    id: 1573,
    question: "What is intelligence?",
    options: ["Memory only", "The mental capacity to learn, reason, and adapt", "Knowledge of facts only", "Speed of typing"],
    answer: "The mental capacity to learn, reason, and adapt",
    category: "Psychology-I"
  },
  {
    id: 1574,
    question: "Who developed the IQ test?",
    options: ["Freud", "Binet", "Skinner", "Watson"],
    answer: "Binet",
    category: "Psychology-I"
  },
  {
    id: 1575,
    question: "What is an average IQ score?",
    options: ["50", "100", "150", "200"],
    answer: "100",
    category: "Psychology-I"
  },
  {
    id: 1576,
    question: "What is a phobia?",
    options: ["A normal fear", "An intense, irrational fear of something specific", "A medication", "A reflex"],
    answer: "An intense, irrational fear of something specific",
    category: "Psychology-I"
  },
  {
    id: 1577,
    question: "What is depression (clinical)?",
    options: ["A passing sadness", "A persistent mood disorder marked by sadness, loss of interest, etc.", "A reflex", "A learning style"],
    answer: "A persistent mood disorder marked by sadness, loss of interest, etc.",
    category: "Psychology-I"
  },
  {
    id: 1578,
    question: "What is anxiety?",
    options: ["A feeling of unease, worry, often about uncertain outcomes", "A physical sensation only", "A reflex", "A skill"],
    answer: "A feeling of unease, worry, often about uncertain outcomes",
    category: "Psychology-I"
  },
  {
    id: 1579,
    question: "What is the central nervous system composed of?",
    options: ["Heart and lungs", "Brain and spinal cord", "Hands and feet", "Eyes and ears"],
    answer: "Brain and spinal cord",
    category: "Psychology-I"
  },
  {
    id: 1580,
    question: "Which part of the brain is associated with reasoning?",
    options: ["Cerebellum", "Frontal lobe / cerebral cortex", "Brain stem", "Hypothalamus"],
    answer: "Frontal lobe / cerebral cortex",
    category: "Psychology-I"
  },
  {
    id: 1581,
    question: "Which brain region is critical for memory formation?",
    options: ["Hippocampus", "Cerebellum", "Brain stem", "Spinal cord"],
    answer: "Hippocampus",
    category: "Psychology-I"
  },
  {
    id: 1582,
    question: "Which brain region coordinates movement and balance?",
    options: ["Frontal lobe", "Cerebellum", "Hippocampus", "Amygdala"],
    answer: "Cerebellum",
    category: "Psychology-I"
  },
  {
    id: 1583,
    question: "What does the amygdala primarily process?",
    options: ["Vision", "Emotions, especially fear", "Movement", "Hearing"],
    answer: "Emotions, especially fear",
    category: "Psychology-I"
  },
  {
    id: 1584,
    question: "What is a neuron?",
    options: ["A muscle cell", "A nerve cell that transmits signals", "A blood cell", "A bone cell"],
    answer: "A nerve cell that transmits signals",
    category: "Psychology-I"
  },
  {
    id: 1585,
    question: "What is a neurotransmitter?",
    options: ["An organ", "A chemical messenger between neurons", "A type of skin", "A muscle"],
    answer: "A chemical messenger between neurons",
    category: "Psychology-I"
  },
  {
    id: 1586,
    question: "Which neurotransmitter is associated with mood and well-being?",
    options: ["Serotonin", "Hemoglobin", "Insulin", "Adrenaline"],
    answer: "Serotonin",
    category: "Psychology-I"
  },
  {
    id: 1587,
    question: "What is dopamine associated with?",
    options: ["Reward and motivation", "Hunger only", "Vision only", "Hearing"],
    answer: "Reward and motivation",
    category: "Psychology-I"
  },
  {
    id: 1588,
    question: "Which research method involves systematic observation of subjects in natural settings?",
    options: ["Experiment", "Naturalistic observation", "Survey", "Case study"],
    answer: "Naturalistic observation",
    category: "Psychology-I"
  },
  {
    id: 1589,
    question: "Which method tests cause-and-effect relationships?",
    options: ["Survey", "Experiment", "Case study", "Observation"],
    answer: "Experiment",
    category: "Psychology-I"
  },
  {
    id: 1590,
    question: "What is the independent variable?",
    options: ["The variable being measured", "The variable being manipulated", "A constant", "A control"],
    answer: "The variable being manipulated",
    category: "Psychology-I"
  },
  {
    id: 1591,
    question: "What is the dependent variable?",
    options: ["The variable being manipulated", "The variable being measured / outcome", "A constant", "Random noise"],
    answer: "The variable being measured / outcome",
    category: "Psychology-I"
  },
  {
    id: 1592,
    question: "What is a placebo?",
    options: ["An active drug", "An inert substance given as if it were medicine", "A vitamin", "A vaccine"],
    answer: "An inert substance given as if it were medicine",
    category: "Psychology-I"
  },
  {
    id: 1593,
    question: "What is the placebo effect?",
    options: ["Improvement attributable to expectation rather than active treatment", "A side effect", "A toxicity", "A dose response"],
    answer: "Improvement attributable to expectation rather than active treatment",
    category: "Psychology-I"
  },
  {
    id: 1594,
    question: "What is socialization?",
    options: ["A party", "The process by which individuals learn norms, values, and behavior of society", "A meeting", "A reflex"],
    answer: "The process by which individuals learn norms, values, and behavior of society",
    category: "Psychology-I"
  },
  {
    id: 1595,
    question: "What is a stereotype?",
    options: ["A speaker system", "A widely held but oversimplified idea about a group", "A scientific fact", "A formal theory"],
    answer: "A widely held but oversimplified idea about a group",
    category: "Psychology-I"
  },
  {
    id: 1596,
    question: "What is conformity?",
    options: ["Standing out", "Adjusting behavior to match group norms", "Aggression", "Independence"],
    answer: "Adjusting behavior to match group norms",
    category: "Psychology-I"
  },
  {
    id: 1597,
    question: "Who conducted the famous obedience experiments?",
    options: ["Skinner", "Milgram", "Pavlov", "Watson"],
    answer: "Milgram",
    category: "Psychology-I"
  },
  {
    id: 1598,
    question: "Who conducted the Stanford prison experiment?",
    options: ["Milgram", "Zimbardo", "Skinner", "Bandura"],
    answer: "Zimbardo",
    category: "Psychology-I"
  },
  {
    id: 1599,
    question: "What does Bandura's Bobo doll study demonstrate?",
    options: ["Classical conditioning", "Observational/social learning", "Operant conditioning", "Genetic theory"],
    answer: "Observational/social learning",
    category: "Psychology-I"
  },
  {
    id: 1600,
    question: "What is empathy?",
    options: ["Indifference", "The ability to understand and share the feelings of others", "Anger", "Aggression"],
    answer: "The ability to understand and share the feelings of others",
    category: "Psychology-I"
  },
  {
    id: 1601,
    question: "What is business writing?",
    options: ["Writing novels", "Clear, purposeful writing for professional and business contexts", "Poetry", "Journalism only"],
    answer: "Clear, purposeful writing for professional and business contexts",
    category: "Business & Technical Writing"
  },
  {
    id: 1602,
    question: "What is technical writing?",
    options: ["Fiction writing", "Communication of technical information clearly to a specific audience", "Marketing copy", "Poetry"],
    answer: "Communication of technical information clearly to a specific audience",
    category: "Business & Technical Writing"
  },
  {
    id: 1603,
    question: "Which is the most important quality of business writing?",
    options: ["Length", "Clarity", "Vocabulary complexity", "Decoration"],
    answer: "Clarity",
    category: "Business & Technical Writing"
  },
  {
    id: 1604,
    question: "What does the 7 Cs of communication include?",
    options: ["Clear, Concise, Concrete, Correct, Coherent, Complete, Courteous", "Color, Code, Class", "Critical, Curious, Calm", "All vague terms"],
    answer: "Clear, Concise, Concrete, Correct, Coherent, Complete, Courteous",
    category: "Business & Technical Writing"
  },
  {
    id: 1605,
    question: "What is the AIDA model in business writing?",
    options: ["Attention, Interest, Desire, Action", "Always In Doubt Always", "A type of letter", "A grammar rule"],
    answer: "Attention, Interest, Desire, Action",
    category: "Business & Technical Writing"
  },
  {
    id: 1606,
    question: "Which of these is a formal business document?",
    options: ["A meme", "A business memo", "A grocery list", "A diary entry"],
    answer: "A business memo",
    category: "Business & Technical Writing"
  },
  {
    id: 1607,
    question: "What is the purpose of a memo?",
    options: ["To send formal external letters", "To communicate internally within an organization", "To advertise", "To submit code"],
    answer: "To communicate internally within an organization",
    category: "Business & Technical Writing"
  },
  {
    id: 1608,
    question: "Which is typical structure of a memo?",
    options: ["TO, FROM, DATE, SUBJECT, BODY", "Just a body", "Random sections", "Only a signature"],
    answer: "TO, FROM, DATE, SUBJECT, BODY",
    category: "Business & Technical Writing"
  },
  {
    id: 1609,
    question: "What is a business letter?",
    options: ["A casual note", "A formal written message between businesses or to individuals", "A poem", "A news article"],
    answer: "A formal written message between businesses or to individuals",
    category: "Business & Technical Writing"
  },
  {
    id: 1610,
    question: "Which salutation is most formal?",
    options: ["Hi there!", "Dear Sir/Madam,", "Hey,", "Yo,"],
    answer: "Dear Sir/Madam,",
    category: "Business & Technical Writing"
  },
  {
    id: 1611,
    question: "Which closing is most formal?",
    options: ["Cheers", "Sincerely,", "Yo!", "Bye"],
    answer: "Sincerely,",
    category: "Business & Technical Writing"
  },
  {
    id: 1612,
    question: "What is a CV / Resume?",
    options: ["A novel", "A summary of qualifications and experience for job applications", "A diary", "A bill"],
    answer: "A summary of qualifications and experience for job applications",
    category: "Business & Technical Writing"
  },
  {
    id: 1613,
    question: "What should a cover letter do?",
    options: ["Repeat the resume word-for-word", "Introduce the candidate and tailor qualifications to a specific job", "Be unrelated to the job", "Be a poem"],
    answer: "Introduce the candidate and tailor qualifications to a specific job",
    category: "Business & Technical Writing"
  },
  {
    id: 1614,
    question: "What is a report?",
    options: ["A casual chat", "A structured document presenting information or findings on a specific topic", "A poem", "A song"],
    answer: "A structured document presenting information or findings on a specific topic",
    category: "Business & Technical Writing"
  },
  {
    id: 1615,
    question: "Which section comes first in a formal report?",
    options: ["Conclusion", "Title page / cover", "References only", "Appendix"],
    answer: "Title page / cover",
    category: "Business & Technical Writing"
  },
  {
    id: 1616,
    question: "What is an executive summary?",
    options: ["A long appendix", "A concise overview of a longer document for busy readers", "A bibliography", "A title only"],
    answer: "A concise overview of a longer document for busy readers",
    category: "Business & Technical Writing"
  },
  {
    id: 1617,
    question: "What is a proposal?",
    options: ["A wedding event", "A document suggesting a course of action or solution", "A poem", "A song"],
    answer: "A document suggesting a course of action or solution",
    category: "Business & Technical Writing"
  },
  {
    id: 1618,
    question: "Which voice is preferred in clear technical writing?",
    options: ["Active voice", "Always passive", "Random", "Neither"],
    answer: "Active voice",
    category: "Business & Technical Writing"
  },
  {
    id: 1619,
    question: "What is jargon?",
    options: ["Standard English", "Specialized vocabulary of a profession", "A type of letter", "A grammar mistake"],
    answer: "Specialized vocabulary of a profession",
    category: "Business & Technical Writing"
  },
  {
    id: 1620,
    question: "When should jargon be avoided?",
    options: ["Always", "When writing for a general or non-specialist audience", "Never", "Only in titles"],
    answer: "When writing for a general or non-specialist audience",
    category: "Business & Technical Writing"
  },
  {
    id: 1621,
    question: "What is a user manual?",
    options: ["A novel", "A document instructing users how to operate a product/system", "A bill", "A poem"],
    answer: "A document instructing users how to operate a product/system",
    category: "Business & Technical Writing"
  },
  {
    id: 1622,
    question: "Which is good practice in instructional writing?",
    options: ["Use complex words", "Use short, numbered steps with imperative verbs", "Use only paragraphs", "Avoid headings"],
    answer: "Use short, numbered steps with imperative verbs",
    category: "Business & Technical Writing"
  },
  {
    id: 1623,
    question: "What is plagiarism in writing?",
    options: ["Citing properly", "Using others' words/ideas without attribution", "Original research", "Paraphrasing with citation"],
    answer: "Using others' words/ideas without attribution",
    category: "Business & Technical Writing"
  },
  {
    id: 1624,
    question: "Which citation style is common in business?",
    options: ["MLA only", "APA, Chicago, or Harvard", "No citations", "Only footnotes"],
    answer: "APA, Chicago, or Harvard",
    category: "Business & Technical Writing"
  },
  {
    id: 1625,
    question: "What is an abstract?",
    options: ["An appendix", "A brief summary of a paper/report's content and findings", "A title only", "A bibliography"],
    answer: "A brief summary of a paper/report's content and findings",
    category: "Business & Technical Writing"
  },
  {
    id: 1626,
    question: "What is the appendix in a report?",
    options: ["The introduction", "Supplementary material at the end (charts, raw data, etc.)", "Title page", "Conclusion"],
    answer: "Supplementary material at the end (charts, raw data, etc.)",
    category: "Business & Technical Writing"
  },
  {
    id: 1627,
    question: "What is a 'call to action'?",
    options: ["A telephone call", "A statement urging the reader to take a specific step", "A heading", "A title page"],
    answer: "A statement urging the reader to take a specific step",
    category: "Business & Technical Writing"
  },
  {
    id: 1628,
    question: "What is the purpose of headings in a document?",
    options: ["Decoration", "Organize content and help readers navigate", "Increase length", "Confuse readers"],
    answer: "Organize content and help readers navigate",
    category: "Business & Technical Writing"
  },
  {
    id: 1629,
    question: "What is white space in document design?",
    options: ["A blank page", "Empty area around text and graphics; improves readability", "An error", "A printer setting only"],
    answer: "Empty area around text and graphics; improves readability",
    category: "Business & Technical Writing"
  },
  {
    id: 1630,
    question: "What is a bullet list good for?",
    options: ["Listing items concisely", "Long narratives", "Quotations only", "Equations"],
    answer: "Listing items concisely",
    category: "Business & Technical Writing"
  },
  {
    id: 1631,
    question: "What does proofreading involve?",
    options: ["Writing a draft", "Carefully reviewing for grammar, spelling, and clarity errors", "Designing layout", "Citing sources"],
    answer: "Carefully reviewing for grammar, spelling, and clarity errors",
    category: "Business & Technical Writing"
  },
  {
    id: 1632,
    question: "Which is a 'persuasive' document type?",
    options: ["Sales proposal", "User manual", "Lab report", "Phone book"],
    answer: "Sales proposal",
    category: "Business & Technical Writing"
  },
  {
    id: 1633,
    question: "Which document outlines meeting decisions and discussions?",
    options: ["Memo", "Minutes of meeting", "Manual", "Brochure"],
    answer: "Minutes of meeting",
    category: "Business & Technical Writing"
  },
  {
    id: 1634,
    question: "What is an agenda?",
    options: ["A list of items to be discussed in a meeting", "Minutes", "A report", "A bibliography"],
    answer: "A list of items to be discussed in a meeting",
    category: "Business & Technical Writing"
  },
  {
    id: 1635,
    question: "Which is correct email etiquette?",
    options: ["Use ALL CAPS", "Use clear subject line and concise content", "Use no greeting", "Be vague"],
    answer: "Use clear subject line and concise content",
    category: "Business & Technical Writing"
  },
  {
    id: 1636,
    question: "What does CC mean in email?",
    options: ["Carbon Copy — visible to recipients", "Confidential Copy", "Closed Comments", "Common Conversation"],
    answer: "Carbon Copy — visible to recipients",
    category: "Business & Technical Writing"
  },
  {
    id: 1637,
    question: "What does BCC mean?",
    options: ["Blind Carbon Copy — recipients don't see other BCC addresses", "Buried Carbon Copy", "Best Customer Copy", "Backup Carbon Copy"],
    answer: "Blind Carbon Copy — recipients don't see other BCC addresses",
    category: "Business & Technical Writing"
  },
  {
    id: 1638,
    question: "Which tone is appropriate for a complaint letter?",
    options: ["Aggressive and rude", "Firm but polite and professional", "Casual slang", "Threatening"],
    answer: "Firm but polite and professional",
    category: "Business & Technical Writing"
  },
  {
    id: 1639,
    question: "Which is the inverted pyramid style used for?",
    options: ["News writing — most important info first", "Poetry", "Coding", "Fiction novels"],
    answer: "News writing — most important info first",
    category: "Business & Technical Writing"
  },
  {
    id: 1640,
    question: "What is the purpose of a table of contents?",
    options: ["Decoration", "Listing sections with page numbers for navigation", "Bibliography", "Citing sources"],
    answer: "Listing sections with page numbers for navigation",
    category: "Business & Technical Writing"
  },
  {
    id: 1641,
    question: "What is technical accuracy?",
    options: ["Random information", "Ensuring information presented is correct and verified", "Decoration", "Length"],
    answer: "Ensuring information presented is correct and verified",
    category: "Business & Technical Writing"
  },
  {
    id: 1642,
    question: "Which is good practice in writing for online?",
    options: ["Long unbroken paragraphs", "Scannable content with short paragraphs and headings", "All caps", "Only images"],
    answer: "Scannable content with short paragraphs and headings",
    category: "Business & Technical Writing"
  },
  {
    id: 1643,
    question: "Which audience analysis question is important?",
    options: ["Who is the audience and what do they need?", "What's for lunch?", "Who designs covers?", "What's the weather?"],
    answer: "Who is the audience and what do they need?",
    category: "Business & Technical Writing"
  },
  {
    id: 1644,
    question: "What is a SOP?",
    options: ["Standard Operating Procedure — step-by-step instructions for routine tasks", "Source of Power", "Statement of Profit", "Standard Office Pen"],
    answer: "Standard Operating Procedure — step-by-step instructions for routine tasks",
    category: "Business & Technical Writing"
  },
  {
    id: 1645,
    question: "Which writing principle says 'less is more'?",
    options: ["Conciseness", "Verbose writing", "Repetition", "Decoration"],
    answer: "Conciseness",
    category: "Business & Technical Writing"
  },
  {
    id: 1646,
    question: "What is the purpose of feedback in business writing?",
    options: ["To validate quality and improve clarity", "To delay work", "To complicate the document", "Decoration"],
    answer: "To validate quality and improve clarity",
    category: "Business & Technical Writing"
  },
  {
    id: 1647,
    question: "What is a press release?",
    options: ["A book", "An official statement issued to news media for publication", "A novel", "A poem"],
    answer: "An official statement issued to news media for publication",
    category: "Business & Technical Writing"
  },
  {
    id: 1648,
    question: "What is a white paper (in business)?",
    options: ["Blank paper", "An authoritative report on a specific issue, often used to inform/persuade", "A novel", "A blog post"],
    answer: "An authoritative report on a specific issue, often used to inform/persuade",
    category: "Business & Technical Writing"
  },
  {
    id: 1649,
    question: "Which is true about active vs passive voice?",
    options: ["Active is generally more direct and engaging", "Passive is always better", "They are the same", "Passive is always shorter"],
    answer: "Active is generally more direct and engaging",
    category: "Business & Technical Writing"
  },
  {
    id: 1650,
    question: "What is the purpose of a glossary?",
    options: ["List of footnotes", "Defining specialized terms used in the document", "An index", "A bibliography"],
    answer: "Defining specialized terms used in the document",
    category: "Business & Technical Writing"
  },
  {
    id: 1651,
    question: "What is mass communication?",
    options: ["One-on-one talk", "Process of conveying information to large audiences via mass media", "Coding", "Hardware design"],
    answer: "Process of conveying information to large audiences via mass media",
    category: "Mass Communication"
  },
  {
    id: 1652,
    question: "Which is NOT a form of mass media?",
    options: ["Newspaper", "Television", "Radio", "Private text message"],
    answer: "Private text message",
    category: "Mass Communication"
  },
  {
    id: 1653,
    question: "Which are traditional mass media?",
    options: ["Print, broadcast, film", "Personal letters", "Phone calls", "Whispers"],
    answer: "Print, broadcast, film",
    category: "Mass Communication"
  },
  {
    id: 1654,
    question: "What is journalism?",
    options: ["A blog post", "The activity of gathering, assessing, and presenting news", "Any social media post", "A novel"],
    answer: "The activity of gathering, assessing, and presenting news",
    category: "Mass Communication"
  },
  {
    id: 1655,
    question: "Who invented the printing press?",
    options: ["Gutenberg", "Newton", "Edison", "Tesla"],
    answer: "Gutenberg",
    category: "Mass Communication"
  },
  {
    id: 1656,
    question: "Which is the first electronic mass medium?",
    options: ["Newspaper", "Radio", "Internet", "Magazine"],
    answer: "Radio",
    category: "Mass Communication"
  },
  {
    id: 1657,
    question: "What is propaganda?",
    options: ["Objective news", "Information used to promote a particular political or social cause", "A book genre", "A film type"],
    answer: "Information used to promote a particular political or social cause",
    category: "Mass Communication"
  },
  {
    id: 1658,
    question: "What is the gatekeeper in mass communication?",
    options: ["A security guard", "Someone who decides what content is published or broadcast", "A reader", "An engineer"],
    answer: "Someone who decides what content is published or broadcast",
    category: "Mass Communication"
  },
  {
    id: 1659,
    question: "What is the role of an editor?",
    options: ["Only typing", "Reviewing, refining, and approving content for publication", "Selling ads", "Printing only"],
    answer: "Reviewing, refining, and approving content for publication",
    category: "Mass Communication"
  },
  {
    id: 1660,
    question: "What is a news lead?",
    options: ["The first sentence/paragraph summarizing the most important info", "The conclusion", "Headline", "Caption"],
    answer: "The first sentence/paragraph summarizing the most important info",
    category: "Mass Communication"
  },
  {
    id: 1661,
    question: "What is the inverted pyramid style?",
    options: ["A type of building", "News writing structure with the most important info first", "Conclusion-first style", "Random order"],
    answer: "News writing structure with the most important info first",
    category: "Mass Communication"
  },
  {
    id: 1662,
    question: "What are the 5 W's of news?",
    options: ["Who, What, When, Where, Why", "When, Whom, Why, We, Will", "Wishful, Worried, etc.", "Wide, Wise, etc."],
    answer: "Who, What, When, Where, Why",
    category: "Mass Communication"
  },
  {
    id: 1663,
    question: "Which is a print medium?",
    options: ["Television", "Newspaper", "Radio", "YouTube"],
    answer: "Newspaper",
    category: "Mass Communication"
  },
  {
    id: 1664,
    question: "Which is a broadcast medium?",
    options: ["Newspaper", "Magazine", "Radio", "Book"],
    answer: "Radio",
    category: "Mass Communication"
  },
  {
    id: 1665,
    question: "Which is new media?",
    options: ["Newspaper", "Radio", "Social media / Internet platforms", "TV cable"],
    answer: "Social media / Internet platforms",
    category: "Mass Communication"
  },
  {
    id: 1666,
    question: "What is convergence in media?",
    options: ["Splitting media", "Merging of different media forms (text, audio, video) into integrated platforms", "Only print", "Audio only"],
    answer: "Merging of different media forms (text, audio, video) into integrated platforms",
    category: "Mass Communication"
  },
  {
    id: 1667,
    question: "What is media bias?",
    options: ["Unbiased reporting", "Slant or partiality in coverage", "Random news", "Decoration"],
    answer: "Slant or partiality in coverage",
    category: "Mass Communication"
  },
  {
    id: 1668,
    question: "What is media ethics?",
    options: ["Random rules", "Principles guiding responsible practice in media (truthfulness, fairness, etc.)", "Just laws", "Marketing"],
    answer: "Principles guiding responsible practice in media (truthfulness, fairness, etc.)",
    category: "Mass Communication"
  },
  {
    id: 1669,
    question: "What is libel?",
    options: ["A spoken false statement", "A published false statement damaging a person's reputation", "A poem", "Truthful reporting"],
    answer: "A published false statement damaging a person's reputation",
    category: "Mass Communication"
  },
  {
    id: 1670,
    question: "What is slander?",
    options: ["Written defamation", "Spoken defamatory statement", "Truth", "Praise"],
    answer: "Spoken defamatory statement",
    category: "Mass Communication"
  },
  {
    id: 1671,
    question: "What is censorship?",
    options: ["Free speech", "Suppression of speech, content, or information", "Free press", "Open access"],
    answer: "Suppression of speech, content, or information",
    category: "Mass Communication"
  },
  {
    id: 1672,
    question: "What is freedom of the press?",
    options: ["Press has no rights", "The right of the media to publish without government censorship", "Only state-owned media", "Free newspapers"],
    answer: "The right of the media to publish without government censorship",
    category: "Mass Communication"
  },
  {
    id: 1673,
    question: "What is public relations (PR)?",
    options: ["Advertising only", "Managing the spread of information between an organization and the public", "Sales only", "Coding"],
    answer: "Managing the spread of information between an organization and the public",
    category: "Mass Communication"
  },
  {
    id: 1674,
    question: "What is advertising?",
    options: ["Free public service", "Paid promotion of products, services, or ideas", "Independent journalism", "A textbook"],
    answer: "Paid promotion of products, services, or ideas",
    category: "Mass Communication"
  },
  {
    id: 1675,
    question: "What is a feature story?",
    options: ["A breaking news brief", "A longer, in-depth article focused on people or trends", "A short ad", "A weather update"],
    answer: "A longer, in-depth article focused on people or trends",
    category: "Mass Communication"
  },
  {
    id: 1676,
    question: "Which is the basic communication model?",
    options: ["Sender → Message → Channel → Receiver → Feedback", "Random model", "Only sender", "Only receiver"],
    answer: "Sender → Message → Channel → Receiver → Feedback",
    category: "Mass Communication"
  },
  {
    id: 1677,
    question: "What is noise in communication?",
    options: ["Loud sound only", "Anything that interferes with the message", "A microphone", "A song"],
    answer: "Anything that interferes with the message",
    category: "Mass Communication"
  },
  {
    id: 1678,
    question: "Who is regarded as a pioneer of communication theory (Shannon-Weaver model)?",
    options: ["Claude Shannon", "Sigmund Freud", "Charles Darwin", "Adam Smith"],
    answer: "Claude Shannon",
    category: "Mass Communication"
  },
  {
    id: 1679,
    question: "Which theory says media tells us 'what to think about'?",
    options: ["Agenda-setting theory", "Behaviorism", "Drive theory", "Existentialism"],
    answer: "Agenda-setting theory",
    category: "Mass Communication"
  },
  {
    id: 1680,
    question: "Who proposed McLuhan's 'the medium is the message'?",
    options: ["Marshall McLuhan", "Walter Lippmann", "Edward Bernays", "Claude Shannon"],
    answer: "Marshall McLuhan",
    category: "Mass Communication"
  },
  {
    id: 1681,
    question: "What is yellow journalism?",
    options: ["Quality journalism", "Sensationalist journalism using exaggeration and scandal", "Color magazines", "A type of paper"],
    answer: "Sensationalist journalism using exaggeration and scandal",
    category: "Mass Communication"
  },
  {
    id: 1682,
    question: "What is investigative journalism?",
    options: ["Light entertainment", "In-depth journalism uncovering hidden information of public interest", "Press release writing", "Advertising"],
    answer: "In-depth journalism uncovering hidden information of public interest",
    category: "Mass Communication"
  },
  {
    id: 1683,
    question: "What is a press conference?",
    options: ["Editorial meeting", "An organized event where journalists ask questions to a public figure", "A printer", "A blog post"],
    answer: "An organized event where journalists ask questions to a public figure",
    category: "Mass Communication"
  },
  {
    id: 1684,
    question: "What does PEMRA regulate in Pakistan?",
    options: ["Banking", "Electronic media", "Education", "Agriculture"],
    answer: "Electronic media",
    category: "Mass Communication"
  },
  {
    id: 1685,
    question: "What is a press release used for?",
    options: ["To officially announce news to media", "Personal diary", "Code review", "Tax filing"],
    answer: "To officially announce news to media",
    category: "Mass Communication"
  },
  {
    id: 1686,
    question: "Which model describes communication as a two-step flow?",
    options: ["Two-step flow theory (opinion leaders mediate media to public)", "Linear model only", "Skinner's box", "Pavlov's bell"],
    answer: "Two-step flow theory (opinion leaders mediate media to public)",
    category: "Mass Communication"
  },
  {
    id: 1687,
    question: "What is cultivation theory?",
    options: ["Farming theory", "The idea that long-term TV exposure shapes viewers' perception of reality", "An economic theory", "A psychology test"],
    answer: "The idea that long-term TV exposure shapes viewers' perception of reality",
    category: "Mass Communication"
  },
  {
    id: 1688,
    question: "What is a news anchor?",
    options: ["A boat anchor", "A person who presents news on TV", "A reporter only", "An editor"],
    answer: "A person who presents news on TV",
    category: "Mass Communication"
  },
  {
    id: 1689,
    question: "What is a column in journalism?",
    options: ["A pillar", "A regular article expressing the writer's opinion or analysis", "A column of numbers", "An ad"],
    answer: "A regular article expressing the writer's opinion or analysis",
    category: "Mass Communication"
  },
  {
    id: 1690,
    question: "What is an editorial?",
    options: ["A breaking news report", "An article expressing the publication's opinion on an issue", "An ad", "A weather report"],
    answer: "An article expressing the publication's opinion on an issue",
    category: "Mass Communication"
  },
  {
    id: 1691,
    question: "What is a tabloid?",
    options: ["A medical product", "A small-format newspaper, often featuring sensational stories", "An ad agency", "A radio show"],
    answer: "A small-format newspaper, often featuring sensational stories",
    category: "Mass Communication"
  },
  {
    id: 1692,
    question: "What is a citizen journalist?",
    options: ["A licensed journalist", "An ordinary person who collects and shares news, often on social media", "A government official", "An editor"],
    answer: "An ordinary person who collects and shares news, often on social media",
    category: "Mass Communication"
  },
  {
    id: 1693,
    question: "What is media literacy?",
    options: ["Reading newspapers", "The ability to access, analyze, evaluate, and create media", "Subscribing to news", "Watching TV"],
    answer: "The ability to access, analyze, evaluate, and create media",
    category: "Mass Communication"
  },
  {
    id: 1694,
    question: "What is a beat in journalism?",
    options: ["Music", "A specific topic area a reporter regularly covers (e.g., sports, politics)", "A type of TV", "An ad"],
    answer: "A specific topic area a reporter regularly covers (e.g., sports, politics)",
    category: "Mass Communication"
  },
  {
    id: 1695,
    question: "What is fake news?",
    options: ["Honest reporting", "False information presented as news", "Editorial opinion", "Sports analysis"],
    answer: "False information presented as news",
    category: "Mass Communication"
  },
  {
    id: 1696,
    question: "What is a byline?",
    options: ["The author credit on an article", "A headline", "A subtitle", "A photo"],
    answer: "The author credit on an article",
    category: "Mass Communication"
  },
  {
    id: 1697,
    question: "What is a deadline in journalism?",
    options: ["A bonus", "The latest time a story can be submitted for publication", "A retirement", "A meeting"],
    answer: "The latest time a story can be submitted for publication",
    category: "Mass Communication"
  },
  {
    id: 1698,
    question: "What is broadcasting?",
    options: ["Private message", "Distributing audio/video content to a wide audience", "Personal call", "Sending an email"],
    answer: "Distributing audio/video content to a wide audience",
    category: "Mass Communication"
  },
  {
    id: 1699,
    question: "What is narrowcasting?",
    options: ["Broadcasting to all", "Targeting a niche audience with specialized content", "Random transmission", "All over the world"],
    answer: "Targeting a niche audience with specialized content",
    category: "Mass Communication"
  },
  {
    id: 1700,
    question: "What is the role of a producer in television?",
    options: ["Only reporting", "Overseeing production aspects of a show including budget, scheduling, content", "Only acting", "Only camera"],
    answer: "Overseeing production aspects of a show including budget, scheduling, content",
    category: "Mass Communication"
  },
  {
    id: 1701,
    question: "What is Organizational Behavior (OB)?",
    options: ["A type of accounting", "Study of how individuals and groups behave within organizations", "Marketing only", "Production planning"],
    answer: "Study of how individuals and groups behave within organizations",
    category: "Organizational Behaviour"
  },
  {
    id: 1702,
    question: "Which is a level of analysis in OB?",
    options: ["Individual, Group, Organizational", "Quantum, Atomic, Cosmic", "Hardware, Software", "Micro, Macro only"],
    answer: "Individual, Group, Organizational",
    category: "Organizational Behaviour"
  },
  {
    id: 1703,
    question: "What is motivation?",
    options: ["Compensation only", "Internal and external factors that drive behavior toward goals", "Random force", "Hatred"],
    answer: "Internal and external factors that drive behavior toward goals",
    category: "Organizational Behaviour"
  },
  {
    id: 1704,
    question: "Maslow's hierarchy applied to work suggests employees seek:",
    options: ["Physiological → safety → social → esteem → self-actualization", "Random rewards", "Only money", "Only fame"],
    answer: "Physiological → safety → social → esteem → self-actualization",
    category: "Organizational Behaviour"
  },
  {
    id: 1705,
    question: "Who proposed the two-factor theory (hygiene and motivators)?",
    options: ["Maslow", "Herzberg", "McGregor", "Vroom"],
    answer: "Herzberg",
    category: "Organizational Behaviour"
  },
  {
    id: 1706,
    question: "Theory X and Theory Y were proposed by:",
    options: ["McGregor", "Maslow", "Herzberg", "Skinner"],
    answer: "McGregor",
    category: "Organizational Behaviour"
  },
  {
    id: 1707,
    question: "Theory X assumes:",
    options: ["Employees are self-motivated", "Employees dislike work and need control", "Employees love work", "Hierarchy is unnecessary"],
    answer: "Employees dislike work and need control",
    category: "Organizational Behaviour"
  },
  {
    id: 1708,
    question: "Theory Y assumes:",
    options: ["Employees are lazy", "Employees are creative and self-motivated under right conditions", "Hierarchy is required", "Pay is the only motivator"],
    answer: "Employees are creative and self-motivated under right conditions",
    category: "Organizational Behaviour"
  },
  {
    id: 1709,
    question: "What is leadership?",
    options: ["Just authority", "The ability to influence others toward achieving goals", "Only management", "Random behavior"],
    answer: "The ability to influence others toward achieving goals",
    category: "Organizational Behaviour"
  },
  {
    id: 1710,
    question: "Which leadership style is participative?",
    options: ["Autocratic", "Democratic", "Laissez-faire only", "None"],
    answer: "Democratic",
    category: "Organizational Behaviour"
  },
  {
    id: 1711,
    question: "Which leadership style is hands-off?",
    options: ["Laissez-faire", "Autocratic", "Democratic", "Transactional"],
    answer: "Laissez-faire",
    category: "Organizational Behaviour"
  },
  {
    id: 1712,
    question: "What is transformational leadership?",
    options: ["Leadership based purely on punishment", "Inspiring followers to exceed expectations through vision and values", "Hands-off only", "Only transactional"],
    answer: "Inspiring followers to exceed expectations through vision and values",
    category: "Organizational Behaviour"
  },
  {
    id: 1713,
    question: "What is transactional leadership?",
    options: ["Vision-driven", "Based on rewards and punishments for performance", "Hands-off", "Servant"],
    answer: "Based on rewards and punishments for performance",
    category: "Organizational Behaviour"
  },
  {
    id: 1714,
    question: "What is a group?",
    options: ["Two or more people interacting toward shared goals", "One person", "An organization-wide system", "A formal corporation"],
    answer: "Two or more people interacting toward shared goals",
    category: "Organizational Behaviour"
  },
  {
    id: 1715,
    question: "What are Tuckman's stages of group development?",
    options: ["Forming, Storming, Norming, Performing, Adjourning", "Plan, Do, Check, Act", "SMART, ABC", "FIFO, LIFO"],
    answer: "Forming, Storming, Norming, Performing, Adjourning",
    category: "Organizational Behaviour"
  },
  {
    id: 1716,
    question: "What is groupthink?",
    options: ["Diverse opinions", "Tendency in groups to suppress dissent for harmony, leading to poor decisions", "Free debate", "Critical analysis"],
    answer: "Tendency in groups to suppress dissent for harmony, leading to poor decisions",
    category: "Organizational Behaviour"
  },
  {
    id: 1717,
    question: "What is organizational culture?",
    options: ["Random rules", "Shared values, beliefs, and practices in an organization", "A salary structure", "An office layout only"],
    answer: "Shared values, beliefs, and practices in an organization",
    category: "Organizational Behaviour"
  },
  {
    id: 1718,
    question: "Who proposed the cultural dimensions theory (e.g., individualism vs collectivism)?",
    options: ["Hofstede", "Maslow", "Vroom", "Herzberg"],
    answer: "Hofstede",
    category: "Organizational Behaviour"
  },
  {
    id: 1719,
    question: "What is power?",
    options: ["Strength only", "The capacity to influence others' behavior", "Aggression", "Wealth only"],
    answer: "The capacity to influence others' behavior",
    category: "Organizational Behaviour"
  },
  {
    id: 1720,
    question: "Which is a type of power?",
    options: ["Legitimate, reward, coercive, expert, referent", "Hot, cold", "Big, small", "Red, blue"],
    answer: "Legitimate, reward, coercive, expert, referent",
    category: "Organizational Behaviour"
  },
  {
    id: 1721,
    question: "What is conflict in organizations?",
    options: ["Always negative", "A disagreement or clash; can be functional or dysfunctional", "Only physical fights", "Only legal disputes"],
    answer: "A disagreement or clash; can be functional or dysfunctional",
    category: "Organizational Behaviour"
  },
  {
    id: 1722,
    question: "Which is a conflict resolution style?",
    options: ["Collaborating", "Random", "Erupting", "Bypassing"],
    answer: "Collaborating",
    category: "Organizational Behaviour"
  },
  {
    id: 1723,
    question: "What is communication in OB?",
    options: ["Talking only", "The transfer of meaning among individuals", "An ad", "Marketing only"],
    answer: "The transfer of meaning among individuals",
    category: "Organizational Behaviour"
  },
  {
    id: 1724,
    question: "What is upward communication?",
    options: ["From subordinates to superiors", "From boss to employees", "Among peers", "Outside organization"],
    answer: "From subordinates to superiors",
    category: "Organizational Behaviour"
  },
  {
    id: 1725,
    question: "What is downward communication?",
    options: ["From superiors to subordinates", "From employees to managers", "Outside organization", "Random"],
    answer: "From superiors to subordinates",
    category: "Organizational Behaviour"
  },
  {
    id: 1726,
    question: "What is horizontal communication?",
    options: ["Among peers/colleagues at same level", "Top-down", "Bottom-up", "External"],
    answer: "Among peers/colleagues at same level",
    category: "Organizational Behaviour"
  },
  {
    id: 1727,
    question: "What is the grapevine?",
    options: ["A real plant", "Informal communication network in organizations", "A formal report", "A hierarchy"],
    answer: "Informal communication network in organizations",
    category: "Organizational Behaviour"
  },
  {
    id: 1728,
    question: "What is job satisfaction?",
    options: ["Just paychecks", "An employee's overall positive feeling toward their job", "Only attendance", "A bonus only"],
    answer: "An employee's overall positive feeling toward their job",
    category: "Organizational Behaviour"
  },
  {
    id: 1729,
    question: "What is organizational commitment?",
    options: ["A meeting time", "An employee's emotional/loyalty attachment to the organization", "A schedule", "A document"],
    answer: "An employee's emotional/loyalty attachment to the organization",
    category: "Organizational Behaviour"
  },
  {
    id: 1730,
    question: "What is stress in organizations?",
    options: ["Always positive", "A psychological/physiological response to demanding situations", "A reward", "A bonus"],
    answer: "A psychological/physiological response to demanding situations",
    category: "Organizational Behaviour"
  },
  {
    id: 1731,
    question: "What is burnout?",
    options: ["A motivation booster", "A state of emotional, mental, and physical exhaustion from prolonged stress", "A vacation", "A reward"],
    answer: "A state of emotional, mental, and physical exhaustion from prolonged stress",
    category: "Organizational Behaviour"
  },
  {
    id: 1732,
    question: "What is organizational change?",
    options: ["Random shuffling", "The process by which organizations transform their structures, strategies, or processes", "Only firings", "Only hires"],
    answer: "The process by which organizations transform their structures, strategies, or processes",
    category: "Organizational Behaviour"
  },
  {
    id: 1733,
    question: "Who proposed the unfreeze-change-refreeze model?",
    options: ["Lewin", "Maslow", "Skinner", "Vroom"],
    answer: "Lewin",
    category: "Organizational Behaviour"
  },
  {
    id: 1734,
    question: "Which is resistance to change?",
    options: ["Skepticism, fear, habit", "Eagerness", "Excitement", "Engagement"],
    answer: "Skepticism, fear, habit",
    category: "Organizational Behaviour"
  },
  {
    id: 1735,
    question: "What is the Big Five personality model?",
    options: ["Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism", "5-step ladder", "5 leadership styles", "5 motivation theories"],
    answer: "Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism",
    category: "Organizational Behaviour"
  },
  {
    id: 1736,
    question: "What is perception in OB?",
    options: ["Strict facts only", "The process by which individuals interpret sensory information", "Memory", "Communication"],
    answer: "The process by which individuals interpret sensory information",
    category: "Organizational Behaviour"
  },
  {
    id: 1737,
    question: "What is attribution?",
    options: ["A type of pay", "Process of explaining the causes of behavior (internal vs external)", "A meeting", "A report"],
    answer: "Process of explaining the causes of behavior (internal vs external)",
    category: "Organizational Behaviour"
  },
  {
    id: 1738,
    question: "What is the halo effect?",
    options: ["Religious phenomenon", "A bias where overall impression of a person influences perception of specific traits", "A type of bonus", "A reward"],
    answer: "A bias where overall impression of a person influences perception of specific traits",
    category: "Organizational Behaviour"
  },
  {
    id: 1739,
    question: "What is decision making?",
    options: ["Random choice", "The process of choosing a course of action among alternatives", "Voting only", "A meeting"],
    answer: "The process of choosing a course of action among alternatives",
    category: "Organizational Behaviour"
  },
  {
    id: 1740,
    question: "What is bounded rationality?",
    options: ["Perfect rationality", "Decision making constrained by limited information, time, and cognitive capacity", "No decision", "Random choices"],
    answer: "Decision making constrained by limited information, time, and cognitive capacity",
    category: "Organizational Behaviour"
  },
  {
    id: 1741,
    question: "What is empowerment?",
    options: ["Cutting authority", "Giving employees autonomy and responsibility", "Random changes", "Layoffs"],
    answer: "Giving employees autonomy and responsibility",
    category: "Organizational Behaviour"
  },
  {
    id: 1742,
    question: "What is performance appraisal?",
    options: ["Hiring", "Evaluating an employee's job performance", "Salary calculation only", "Termination"],
    answer: "Evaluating an employee's job performance",
    category: "Organizational Behaviour"
  },
  {
    id: 1743,
    question: "What is 360-degree feedback?",
    options: ["A spinning chair", "Feedback from peers, subordinates, supervisors, and self", "Only manager feedback", "Random ratings"],
    answer: "Feedback from peers, subordinates, supervisors, and self",
    category: "Organizational Behaviour"
  },
  {
    id: 1744,
    question: "What is organizational structure?",
    options: ["Building layout", "The formal arrangement of jobs and reporting relationships", "Just hierarchy depth", "Office furniture"],
    answer: "The formal arrangement of jobs and reporting relationships",
    category: "Organizational Behaviour"
  },
  {
    id: 1745,
    question: "What is a flat organization?",
    options: ["Many levels", "Few hierarchical levels, wider span of control", "Random levels", "Only top-down"],
    answer: "Few hierarchical levels, wider span of control",
    category: "Organizational Behaviour"
  },
  {
    id: 1746,
    question: "What is a tall organization?",
    options: ["Few levels", "Many hierarchical levels with narrow span of control", "Random levels", "Flat"],
    answer: "Many hierarchical levels with narrow span of control",
    category: "Organizational Behaviour"
  },
  {
    id: 1747,
    question: "What is a matrix organization?",
    options: ["Single hierarchy", "Employees report to multiple managers (functional and project)", "Movie reference only", "Flat"],
    answer: "Employees report to multiple managers (functional and project)",
    category: "Organizational Behaviour"
  },
  {
    id: 1748,
    question: "What is delegation?",
    options: ["Doing all work yourself", "Assigning authority and responsibility to subordinates", "Hiring", "Firing"],
    answer: "Assigning authority and responsibility to subordinates",
    category: "Organizational Behaviour"
  },
  {
    id: 1749,
    question: "What is teamwork?",
    options: ["Working alone", "Collaborative effort of a group toward a common goal", "Independent tasks only", "Competition"],
    answer: "Collaborative effort of a group toward a common goal",
    category: "Organizational Behaviour"
  },
  {
    id: 1750,
    question: "What is emotional intelligence (EI)?",
    options: ["IQ only", "The ability to understand and manage emotions in self and others", "Memorization", "Random reactions"],
    answer: "The ability to understand and manage emotions in self and others",
    category: "Organizational Behaviour"
  },
  {
    id: 1751,
    question: "What are professional practices?",
    options: ["Random behavior", "Ethical and standard methods of conduct in a profession", "A coding language", "A database"],
    answer: "Ethical and standard methods of conduct in a profession",
    category: "Professional Practices"
  },
  {
    id: 1752,
    question: "What is professional ethics?",
    options: ["Personal preferences", "Moral principles guiding professional behavior", "Random rules", "Marketing"],
    answer: "Moral principles guiding professional behavior",
    category: "Professional Practices"
  },
  {
    id: 1753,
    question: "Which is a key professional virtue?",
    options: ["Honesty / integrity", "Greed", "Cheating", "Bias"],
    answer: "Honesty / integrity",
    category: "Professional Practices"
  },
  {
    id: 1754,
    question: "What is a code of ethics?",
    options: ["A coding standard for software", "A formal document outlining professional standards of conduct", "A salary chart", "A bug list"],
    answer: "A formal document outlining professional standards of conduct",
    category: "Professional Practices"
  },
  {
    id: 1755,
    question: "Which organization has a code of ethics for software professionals?",
    options: ["IEEE / ACM", "FBI", "NASA only", "WHO"],
    answer: "IEEE / ACM",
    category: "Professional Practices"
  },
  {
    id: 1756,
    question: "What is intellectual property (IP)?",
    options: ["Only physical property", "Creations of the mind protected by law (e.g., patents, copyrights)", "Anyone's idea", "Free for all"],
    answer: "Creations of the mind protected by law (e.g., patents, copyrights)",
    category: "Professional Practices"
  },
  {
    id: 1757,
    question: "What is a copyright?",
    options: ["Patent", "Legal right protecting original works of authorship", "Trademark", "Trade secret"],
    answer: "Legal right protecting original works of authorship",
    category: "Professional Practices"
  },
  {
    id: 1758,
    question: "What is a patent?",
    options: ["A copyright", "Exclusive right granted for an invention for a limited time", "A trademark", "A book"],
    answer: "Exclusive right granted for an invention for a limited time",
    category: "Professional Practices"
  },
  {
    id: 1759,
    question: "What is a trademark?",
    options: ["A copyright", "A symbol/logo/name legally registered to identify a brand", "A patent", "A trade secret"],
    answer: "A symbol/logo/name legally registered to identify a brand",
    category: "Professional Practices"
  },
  {
    id: 1760,
    question: "What is open-source software?",
    options: ["Always free of charge", "Software whose source code is openly available, often free to modify and share", "Closed proprietary", "Random binary"],
    answer: "Software whose source code is openly available, often free to modify and share",
    category: "Professional Practices"
  },
  {
    id: 1761,
    question: "Which is a popular open-source license?",
    options: ["MIT / GPL / Apache", "Photoshop", "MS Office", "Outlook"],
    answer: "MIT / GPL / Apache",
    category: "Professional Practices"
  },
  {
    id: 1762,
    question: "What is software piracy?",
    options: ["Selling licensed copies", "Unauthorized copying or distribution of software", "Open-source sharing", "Donating software"],
    answer: "Unauthorized copying or distribution of software",
    category: "Professional Practices"
  },
  {
    id: 1763,
    question: "What is an EULA?",
    options: ["End User License Agreement — terms users agree to when using software", "European Union Legal Act", "Engineering Universal License Article", "Electronic User Library Access"],
    answer: "End User License Agreement — terms users agree to when using software",
    category: "Professional Practices"
  },
  {
    id: 1764,
    question: "What is data privacy?",
    options: ["Public data", "The right and practice of protecting personal information", "Open data", "Free data"],
    answer: "The right and practice of protecting personal information",
    category: "Professional Practices"
  },
  {
    id: 1765,
    question: "Which is a data privacy regulation?",
    options: ["GDPR (EU)", "ISO 9001 only", "ANSI standards", "ITU specs"],
    answer: "GDPR (EU)",
    category: "Professional Practices"
  },
  {
    id: 1766,
    question: "What is a non-disclosure agreement (NDA)?",
    options: ["A public statement", "A legal contract restricting sharing of confidential information", "A marketing tool", "A patent"],
    answer: "A legal contract restricting sharing of confidential information",
    category: "Professional Practices"
  },
  {
    id: 1767,
    question: "What is conflict of interest?",
    options: ["Choosing a hobby", "A situation where personal interests interfere with professional duties", "Doing one's job", "Random conflict"],
    answer: "A situation where personal interests interfere with professional duties",
    category: "Professional Practices"
  },
  {
    id: 1768,
    question: "What is whistleblowing?",
    options: ["A sport", "Reporting unethical or illegal activities by an organization", "A tool", "A casual habit"],
    answer: "Reporting unethical or illegal activities by an organization",
    category: "Professional Practices"
  },
  {
    id: 1769,
    question: "What is a professional certification?",
    options: ["A degree", "A credential awarded after meeting standards of expertise in a profession", "A diploma", "A passport"],
    answer: "A credential awarded after meeting standards of expertise in a profession",
    category: "Professional Practices"
  },
  {
    id: 1770,
    question: "Which is an IT certification?",
    options: ["CCNA / PMP / AWS Certified", "MBA only", "B.Tech", "MS"],
    answer: "CCNA / PMP / AWS Certified",
    category: "Professional Practices"
  },
  {
    id: 1771,
    question: "What is continuing professional development (CPD)?",
    options: ["A one-time course", "Ongoing learning to maintain and develop professional skills", "Retirement", "A salary raise"],
    answer: "Ongoing learning to maintain and develop professional skills",
    category: "Professional Practices"
  },
  {
    id: 1772,
    question: "Which is a soft skill?",
    options: ["Communication", "Writing C++ code", "Database tuning", "Network configuration"],
    answer: "Communication",
    category: "Professional Practices"
  },
  {
    id: 1773,
    question: "Which is a hard skill?",
    options: ["Empathy", "Programming in Python", "Teamwork", "Leadership"],
    answer: "Programming in Python",
    category: "Professional Practices"
  },
  {
    id: 1774,
    question: "What is professionalism?",
    options: ["Wearing a suit only", "Conducting oneself with responsibility, integrity, accountability, and excellence", "A random behavior", "Being aggressive"],
    answer: "Conducting oneself with responsibility, integrity, accountability, and excellence",
    category: "Professional Practices"
  },
  {
    id: 1775,
    question: "What is workplace harassment?",
    options: ["Friendly banter", "Unwelcome behavior creating a hostile work environment", "A salary issue", "A cost"],
    answer: "Unwelcome behavior creating a hostile work environment",
    category: "Professional Practices"
  },
  {
    id: 1776,
    question: "What is workplace diversity?",
    options: ["Hiring uniform people", "Including individuals with varied backgrounds and identities", "Single demographic", "Random hires"],
    answer: "Including individuals with varied backgrounds and identities",
    category: "Professional Practices"
  },
  {
    id: 1777,
    question: "What is inclusion in the workplace?",
    options: ["Excluding some", "Ensuring all employees feel valued and have equal opportunities", "Random hiring", "Limited access"],
    answer: "Ensuring all employees feel valued and have equal opportunities",
    category: "Professional Practices"
  },
  {
    id: 1778,
    question: "What is corporate social responsibility (CSR)?",
    options: ["Random acts", "A company's commitment to ethical conduct and societal benefit", "Profit only", "Marketing only"],
    answer: "A company's commitment to ethical conduct and societal benefit",
    category: "Professional Practices"
  },
  {
    id: 1779,
    question: "What is sustainability in business?",
    options: ["Short-term focus", "Operating in ways that meet current needs without compromising future generations", "Bankruptcy", "Random spending"],
    answer: "Operating in ways that meet current needs without compromising future generations",
    category: "Professional Practices"
  },
  {
    id: 1780,
    question: "What is a 'duty of care'?",
    options: ["Optional politeness", "A legal/ethical obligation to ensure safety and wellbeing of others", "A favor", "A salary"],
    answer: "A legal/ethical obligation to ensure safety and wellbeing of others",
    category: "Professional Practices"
  },
  {
    id: 1781,
    question: "What is informed consent?",
    options: ["Forced agreement", "Permission given with full knowledge of consequences", "Random agreement", "Unwritten rule"],
    answer: "Permission given with full knowledge of consequences",
    category: "Professional Practices"
  },
  {
    id: 1782,
    question: "What does 'due diligence' mean?",
    options: ["Random checks", "Reasonable steps taken before making a decision or commitment", "A bonus", "A penalty"],
    answer: "Reasonable steps taken before making a decision or commitment",
    category: "Professional Practices"
  },
  {
    id: 1783,
    question: "What is plagiarism in academic/professional context?",
    options: ["Citing properly", "Using others' work or ideas without credit", "Original writing", "A type of award"],
    answer: "Using others' work or ideas without credit",
    category: "Professional Practices"
  },
  {
    id: 1784,
    question: "Which is a basic right of computer users?",
    options: ["Privacy of personal data", "Random surveillance", "Public data leaks", "Forced disclosure"],
    answer: "Privacy of personal data",
    category: "Professional Practices"
  },
  {
    id: 1785,
    question: "What is computer ethics?",
    options: ["Standard of behavior in using computers and information systems", "A bug list", "Hardware design", "A virus"],
    answer: "Standard of behavior in using computers and information systems",
    category: "Professional Practices"
  },
  {
    id: 1786,
    question: "Who developed the Ten Commandments of Computer Ethics?",
    options: ["Computer Ethics Institute", "FBI", "Apple", "Microsoft"],
    answer: "Computer Ethics Institute",
    category: "Professional Practices"
  },
  {
    id: 1787,
    question: "Which is unethical use of computers?",
    options: ["Hacking into another person's system", "Writing your own program", "Reading documentation", "Updating software"],
    answer: "Hacking into another person's system",
    category: "Professional Practices"
  },
  {
    id: 1788,
    question: "What is digital divide?",
    options: ["A literal divide", "The gap between those with and without access to digital technology", "A monitor", "A hardware issue"],
    answer: "The gap between those with and without access to digital technology",
    category: "Professional Practices"
  },
  {
    id: 1789,
    question: "What is netiquette?",
    options: ["Internet manners — etiquette for online communication", "A type of network protocol", "A device", "A virus"],
    answer: "Internet manners — etiquette for online communication",
    category: "Professional Practices"
  },
  {
    id: 1790,
    question: "What is cyberbullying?",
    options: ["Friendly chat", "Bullying behavior conducted through digital channels", "Healthy debate", "An award"],
    answer: "Bullying behavior conducted through digital channels",
    category: "Professional Practices"
  },
  {
    id: 1791,
    question: "Which is a professional society for IT?",
    options: ["IEEE / ACM", "WHO", "FIFA", "UNICEF"],
    answer: "IEEE / ACM",
    category: "Professional Practices"
  },
  {
    id: 1792,
    question: "What is a service-level agreement (SLA)?",
    options: ["A handshake only", "A documented agreement specifying expected service levels between provider and client", "A receipt", "A salary"],
    answer: "A documented agreement specifying expected service levels between provider and client",
    category: "Professional Practices"
  },
  {
    id: 1793,
    question: "Which is true about software warranties?",
    options: ["They never exist", "They limit the seller's liability and define remedies for defects", "They are unlimited", "They are always void"],
    answer: "They limit the seller's liability and define remedies for defects",
    category: "Professional Practices"
  },
  {
    id: 1794,
    question: "What is software liability?",
    options: ["No accountability ever", "Legal responsibility for harm caused by software defects", "A bonus", "A kind of bug"],
    answer: "Legal responsibility for harm caused by software defects",
    category: "Professional Practices"
  },
  {
    id: 1795,
    question: "What is a non-compete clause?",
    options: ["A free pass to work anywhere", "A contract clause preventing an employee from working for competitors after leaving", "A salary clause", "A random clause"],
    answer: "A contract clause preventing an employee from working for competitors after leaving",
    category: "Professional Practices"
  },
  {
    id: 1796,
    question: "Which is good professional practice in handling client data?",
    options: ["Sharing freely", "Maintaining confidentiality and using least privilege", "Posting publicly", "Reselling without consent"],
    answer: "Maintaining confidentiality and using least privilege",
    category: "Professional Practices"
  },
  {
    id: 1797,
    question: "What is a portfolio (professional)?",
    options: ["A briefcase", "A curated collection of one's work showcasing skills and experience", "A diploma", "A salary slip"],
    answer: "A curated collection of one's work showcasing skills and experience",
    category: "Professional Practices"
  },
  {
    id: 1798,
    question: "What is networking (professional)?",
    options: ["Cabling", "Building professional relationships for mutual support and opportunities", "A device", "A protocol"],
    answer: "Building professional relationships for mutual support and opportunities",
    category: "Professional Practices"
  },
  {
    id: 1799,
    question: "Which is an unethical business practice?",
    options: ["Bribery", "Honest pricing", "Quality assurance", "Customer service"],
    answer: "Bribery",
    category: "Professional Practices"
  },
  {
    id: 1800,
    question: "What is the ultimate goal of professional ethics?",
    options: ["Personal gain only", "Promote trust, integrity, and the public good in the profession", "Avoiding work", "Unfair advantage"],
    answer: "Promote trust, integrity, and the public good in the profession",
    category: "Professional Practices"
  }
];

export default QUESTION_BANK;