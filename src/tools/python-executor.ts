/**
 * Python Executor Tool Integration
 * 
 * This module provides Python execution capabilities for Iron Manus MCP through integration
 * with the MCP IDE executeCode tool. It bridges Iron Manus MCP tools with Python data science
 * execution environment, offering both basic Python execution and comprehensive data science
 * operations.
 * 
 * The module includes:
 * - PythonExecutorTool: Basic Python code execution with library management
 * - EnhancedPythonDataScienceTool: Complete data science workflows with auto-generated code
 * 
 * Integration Pattern:
 * 1. Tools prepare Python code with library setup
 * 2. Code is formatted for MCP IDE executeCode tool
 * 3. Libraries are auto-installed using pip if missing
 * 4. Execution happens in persistent Jupyter kernel
 * 
 * @fileoverview Python execution and data science integration for Iron Manus MCP
 * @author Iron Manus MCP Team
 * @version 1.0.0
 */

import { BaseTool, ToolResult, ToolSchema } from './base-tool.js';

/**
 * Arguments interface for Python code execution
 * 
 * @interface PythonExecutorArgs
 * @property {string} code - The Python code to execute (required)
 * @property {string[]} [setup_libraries] - Array of library names to install/import before execution
 * @property {string} [description] - Optional description of what the code does for documentation
 */
export interface PythonExecutorArgs {
  code: string;
  setup_libraries?: string[];
  description?: string;
}

/**
 * Python Executor Tool
 * 
 * Executes Python code through MCP IDE executeCode tool with automatic library management.
 * This tool serves as a bridge between Iron Manus MCP and the MCP IDE Python execution
 * environment, handling library installation and code preparation.
 * 
 * Key Features:
 * - Automatic library installation via pip
 * - Code preparation with proper imports
 * - Integration with MCP IDE executeCode tool
 * - Error handling and validation
 * - Support for common data science libraries
 * 
 * Usage Flow:
 * 1. Validates input arguments
 * 2. Prepares code with library setup
 * 3. Returns formatted instructions for MCP IDE execution
 * 4. Libraries are auto-installed if missing during execution
 * 
 * @class PythonExecutorTool
 * @extends BaseTool
 * @example
 * ```typescript
 * const tool = new PythonExecutorTool();
 * const result = await tool.handle({
 *   code: "import pandas as pd\nprint(pd.__version__)",
 *   setup_libraries: ["pandas"],
 *   description: "Check pandas version"
 * });
 * ```
 */
export class PythonExecutorTool extends BaseTool {
  readonly name = 'PythonExecutor';
  readonly description = 'Execute Python code with data science libraries through MCP IDE kernel';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Python code to execute',
      },
      setup_libraries: {
        type: 'array',
        items: { type: 'string' },
        description: 'Libraries to install/import before execution',
      },
      description: {
        type: 'string',
        description: 'Description of what the code does',
      },
    },
    required: ['code'],
    additionalProperties: false,
  };

  /**
   * Handles Python code execution requests
   * 
   * Processes Python code execution requests by validating arguments, preparing code with
   * library setup, and formatting instructions for MCP IDE executeCode tool integration.
   * 
   * Error Handling:
   * - Validates required arguments (code must be provided)
   * - Catches and formats execution errors
   * - Returns structured error responses for debugging
   * 
   * @param {PythonExecutorArgs} args - The execution arguments containing code and setup options
   * @returns {Promise<ToolResult>} Promise resolving to execution instructions or error response
   * 
   * @throws {Error} When code argument is missing or invalid
   * 
   * @example
   * ```typescript
   * const result = await tool.handle({
   *   code: "print('Hello, World!')",
   *   setup_libraries: ["requests"],
   *   description: "Simple hello world example"
   * });
   * ```
   */
  async handle(args: PythonExecutorArgs): Promise<ToolResult> {
    try {
      this.validateArgs(args);

      // Prepare the full Python code with setup
      const fullCode = this.prepareCode(args);

      // NOTE: In actual implementation, this would call the MCP IDE executeCode tool
      // For now, we return the prepared code that should be executed

      return this.createResponse(
        JSON.stringify(
          {
            action: 'execute_python',
            prepared_code: fullCode,
            description: args.description || 'Python data science execution',
            next_step: 'Use mcp__ide__executeCode tool with this prepared code',
            libraries_to_check: args.setup_libraries || [],
          },
          null,
          2
        )
      );
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Prepares Python code with library setup and imports
   * 
   * Combines user code with auto-generated library installation and import code.
   * The preparation process ensures all required libraries are available before
   * executing the main code.
   * 
   * Code Structure:
   * 1. Library installation/import section (if libraries specified)
   * 2. User's main code
   * 
   * @private
   * @param {PythonExecutorArgs} args - The execution arguments containing code and libraries
   * @returns {string} The complete Python code ready for execution
   * 
   * @example
   * ```typescript
   * const fullCode = this.prepareCode({
   *   code: "df = pd.DataFrame({'a': [1, 2, 3]})",
   *   setup_libraries: ["pandas"]
   * });
   * // Returns: library setup code + user code
   * ```
   */
  private prepareCode(args: PythonExecutorArgs): string {
    const { code, setup_libraries } = args;

    let fullCode = '';

    // Add library installation/import if needed
    if (setup_libraries && setup_libraries.length > 0) {
      fullCode += this.generateLibrarySetup(setup_libraries);
      fullCode += '\n\n';
    }

    // Add the main code
    fullCode += code;

    return fullCode;
  }

  /**
   * Generates Python code for automatic library installation and import
   * 
   * Creates Python code that attempts to import each library and automatically
   * installs it via pip if the import fails. Handles common library name mappings
   * where the import name differs from the package name.
   * 
   * Library Name Mappings:
   * - bs4 → beautifulsoup4
   * - sklearn → scikit-learn
   * - cv2 → opencv-python
   * 
   * Generated Code Pattern:
   * ```python
   * try:
   *     import library_name
   * except ImportError:
   *     subprocess.check_call([sys.executable, "-m", "pip", "install", "package_name"])
   *     import library_name
   * ```
   * 
   * @private
   * @param {string[]} libraries - Array of library names to install/import
   * @returns {string} Python code for library setup with auto-installation
   * 
   * @example
   * ```typescript
   * const setupCode = this.generateLibrarySetup(["pandas", "bs4"]);
   * // Returns Python code that imports pandas and beautifulsoup4
   * ```
   */
  private generateLibrarySetup(libraries: string[]): string {
    const installCode = libraries
      .map(lib => {
        // Common library installation patterns
        const installMap: Record<string, string> = {
          bs4: 'beautifulsoup4',
          sklearn: 'scikit-learn',
          cv2: 'opencv-python',
        };

        const packageName = installMap[lib] || lib;
        return `
try:
    import ${lib}
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "${packageName}"])
    import ${lib}`;
      })
      .join('\n');

    return `# Auto-install and import required libraries
${installCode}

print("✅ All required libraries loaded successfully")`;
  }
}

/**
 * Enhanced Python Data Science Tool
 * 
 * Comprehensive data science tool that combines intelligent code generation with execution
 * instructions for common data science workflows. This tool generates complete, ready-to-run
 * Python code for various data science operations.
 * 
 * Supported Operations:
 * - web_scraping: Extract data from websites using BeautifulSoup and requests
 * - data_analysis: Comprehensive data analysis with pandas and numpy
 * - visualization: Create charts and plots with matplotlib and seaborn
 * - machine_learning: Build and evaluate ML models with scikit-learn
 * - custom: Execute user-provided custom Python code
 * 
 * Key Features:
 * - Auto-generates complete, production-ready code
 * - Handles library installation automatically
 * - Provides comprehensive error handling
 * - Includes detailed output and logging
 * - Supports both structured and unstructured data
 * 
 * Integration with MCP IDE:
 * - Generates code compatible with Jupyter kernels
 * - Returns execution instructions for mcp__ide__executeCode
 * - Maintains persistent state across executions
 * - Handles library dependencies automatically
 * 
 * @class EnhancedPythonDataScienceTool
 * @extends BaseTool
 * @example
 * ```typescript
 * const tool = new EnhancedPythonDataScienceTool();
 * const result = await tool.handle({
 *   operation: "data_analysis",
 *   input_data: "sales,profit\n100,20\n200,30",
 *   parameters: { analyze_correlations: true }
 * });
 * ```
 */
export class EnhancedPythonDataScienceTool extends BaseTool {
  readonly name = 'EnhancedPythonDataScience';
  readonly description = 'Complete Python data science operations with automatic execution';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['web_scraping', 'data_analysis', 'visualization', 'machine_learning', 'custom'],
        description: 'Type of data science operation',
      },
      input_data: {
        type: 'string',
        description: 'Input data (URL, CSV, JSON, HTML, etc.)',
      },
      parameters: {
        type: 'object',
        description: 'Operation-specific parameters',
      },
      custom_code: {
        type: 'string',
        description: 'Custom Python code for custom operations',
      },
    },
    required: ['operation'],
    additionalProperties: false,
  };

  /**
   * Handles data science operation requests
   * 
   * Processes data science requests by generating appropriate Python code based on the
   * operation type, input data, and parameters. Returns complete execution instructions
   * for integration with MCP IDE executeCode tool.
   * 
   * Operation Types:
   * - web_scraping: Generates BeautifulSoup-based scraping code
   * - data_analysis: Creates comprehensive pandas analysis code
   * - visualization: Builds matplotlib/seaborn visualization code
   * - machine_learning: Develops scikit-learn ML pipeline code
   * - custom: Wraps user code with library setup
   * 
   * Error Handling:
   * - Validates operation type and required parameters
   * - Handles code generation errors gracefully
   * - Returns structured error responses with debugging info
   * - Catches and formats library-related errors
   * 
   * @param {any} args - The operation arguments containing operation type, data, and parameters
   * @returns {Promise<ToolResult>} Promise resolving to generated code and execution instructions
   * 
   * @throws {Error} When operation type is invalid or code generation fails
   * 
   * @example
   * ```typescript
   * const result = await tool.handle({
   *   operation: "visualization",
   *   input_data: "x,y\n1,2\n3,4",
   *   parameters: { chart_type: "scatter" }
   * });
   * ```
   */
  async handle(args: any): Promise<ToolResult> {
    try {
      this.validateArgs(args);

      const { operation, input_data, parameters, custom_code } = args;

      // Generate operation-specific code
      const generatedCode = this.generateOperationCode(
        operation,
        input_data,
        parameters,
        custom_code
      );

      // Prepare execution instructions
      const result = {
        operation,
        generated_code: generatedCode,
        execution_ready: true,
        instructions: [
          '1. Use mcp__ide__executeCode tool with the generated_code',
          '2. Libraries will be auto-installed if missing',
          '3. Results will be displayed in the Jupyter kernel',
        ],
        required_libraries: this.getRequiredLibraries(operation),
      };

      return this.createResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Generates operation-specific Python code
   * 
   * Central code generation dispatcher that routes to appropriate code generators
   * based on the operation type. Handles custom code execution and validates
   * operation types.
   * 
   * Operation Routing:
   * - custom: Wraps user code with basic library setup
   * - web_scraping: Generates BeautifulSoup scraping code
   * - data_analysis: Creates pandas analysis workflows
   * - visualization: Builds matplotlib/seaborn charts
   * - machine_learning: Develops scikit-learn pipelines
   * 
   * @private
   * @param {string} operation - The type of data science operation to perform
   * @param {string} [inputData] - Optional input data (URL, CSV, JSON, etc.)
   * @param {any} [parameters] - Optional operation-specific parameters
   * @param {string} [customCode] - Optional custom Python code for custom operations
   * @returns {string} Generated Python code ready for execution
   * 
   * @throws {Error} When operation type is not supported
   * 
   * @example
   * ```typescript
   * const code = this.generateOperationCode(
   *   "data_analysis",
   *   "name,age\nAlice,25\nBob,30",
   *   { include_plots: true }
   * );
   * ```
   */
  private generateOperationCode(
    operation: string,
    inputData?: string,
    parameters?: any,
    customCode?: string
  ): string {
    if (operation === 'custom' && customCode) {
      return this.wrapWithLibrarySetup(customCode, ['pandas', 'numpy']);
    }

    switch (operation) {
      case 'web_scraping':
        return this.generateWebScrapingCode(inputData, parameters);

      case 'data_analysis':
        return this.generateDataAnalysisCode(inputData, parameters);

      case 'visualization':
        return this.generateVisualizationCode(inputData, parameters);

      case 'machine_learning':
        return this.generateMLCode(inputData, parameters);

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  /**
   * Generates web scraping code using BeautifulSoup and requests
   * 
   * Creates comprehensive web scraping code that fetches web pages, parses HTML,
   * and extracts common elements like titles, headings, paragraphs, and links.
   * Includes proper error handling and user-agent headers.
   * 
   * Generated Code Features:
   * - Proper user-agent headers to avoid blocking
   * - Comprehensive error handling for network requests
   * - Extraction of titles, headings, paragraphs, and links
   * - DataFrame creation for structured data
   * - Detailed logging and progress feedback
   * 
   * @private
   * @param {string} [url] - The URL to scrape (defaults to example.com)
   * @param {any} [params] - Additional parameters for scraping customization
   * @returns {string} Python code for web scraping with BeautifulSoup
   * 
   * @example
   * ```typescript
   * const code = this.generateWebScrapingCode("https://example.com");
   * // Returns complete scraping code with error handling
   * ```
   */
  private generateWebScrapingCode(url?: string, params?: any): string {
    return this.wrapWithLibrarySetup(
      `
# Web scraping with BeautifulSoup and requests
import requests
from bs4 import BeautifulSoup
import pandas as pd

url = "${url || 'https://example.com'}"
headers = {'User-Agent': 'Mozilla/5.0 (compatible; Data Science Tool)'}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract common elements
    data = {
        'title': soup.find('title').text if soup.find('title') else 'No title',
        'headings': [h.get_text().strip() for h in soup.find_all(['h1', 'h2', 'h3'])],
        'paragraphs': [p.get_text().strip() for p in soup.find_all('p')[:10]],  # First 10 paragraphs
        'links': [{'text': a.get_text().strip(), 'href': a.get('href')} 
                 for a in soup.find_all('a', href=True)[:20]]  # First 20 links
    }
    
    print("✅ Web scraping completed successfully")
    print(f"Title: {data['title']}")
    print(f"Found {len(data['headings'])} headings")
    print(f"Found {len(data['paragraphs'])} paragraphs")
    print(f"Found {len(data['links'])} links")
    
    # Create DataFrame for links
    if data['links']:
        links_df = pd.DataFrame(data['links'])
        print("\\nLinks DataFrame:")
        print(links_df.head())
    
except Exception as e:
    print(f"❌ Error scraping {url}: {e}")
`,
      ['requests', 'bs4', 'pandas']
    );
  }

  /**
   * Generates comprehensive data analysis code using pandas and numpy
   * 
   * Creates extensive data analysis workflows including dataset overview,
   * statistical summaries, data quality checks, and correlation analysis.
   * Handles both provided data and generates sample data when needed.
   * 
   * Generated Analysis Includes:
   * - Dataset shape and column information
   * - Statistical summaries (describe, mean, median, etc.)
   * - Missing value analysis
   * - Data type information
   * - Correlation matrix for numeric columns
   * - Memory usage analysis
   * 
   * @private
   * @param {string} [data] - Optional CSV data string to analyze
   * @param {any} [params] - Additional parameters for analysis customization
   * @returns {string} Python code for comprehensive data analysis
   * 
   * @example
   * ```typescript
   * const code = this.generateDataAnalysisCode("name,age\nAlice,25\nBob,30");
   * // Returns complete analysis code with statistical summaries
   * ```
   */
  private generateDataAnalysisCode(data?: string, params?: any): string {
    return this.wrapWithLibrarySetup(
      `
# Data analysis with pandas and numpy
import pandas as pd
import numpy as np
from io import StringIO

# Sample or provided data
${
  data
    ? `
# Using provided data
data_str = """${data}"""
try:
    # Try to parse as CSV
    df = pd.read_csv(StringIO(data_str))
    print("✅ Data loaded from provided CSV")
except:
    # Create sample data if parsing fails
    df = pd.DataFrame({
        'A': np.random.randn(100),
        'B': np.random.randn(100),
        'C': np.random.randint(1, 5, 100),
        'D': np.random.choice(['X', 'Y', 'Z'], 100)
    })
    print("⚠️ Using sample data (CSV parsing failed)")
`
    : `
# Sample dataset
df = pd.DataFrame({
    'sales': np.random.randint(100, 1000, 100),
    'profit': np.random.randint(10, 100, 100),
    'region': np.random.choice(['North', 'South', 'East', 'West'], 100),
    'product': np.random.choice(['A', 'B', 'C'], 100)
})
print("✅ Sample dataset created")
`
}

# Comprehensive analysis
print("\\n📊 DATASET OVERVIEW")
print("=" * 50)
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024:.2f} KB")

print("\\n📈 STATISTICAL SUMMARY")
print("=" * 50)
print(df.describe())

print("\\n🔍 DATA QUALITY CHECK")
print("=" * 50)
print("Missing values:")
print(df.isnull().sum())
print("\\nData types:")
print(df.dtypes)

# Correlation analysis for numeric columns
numeric_cols = df.select_dtypes(include=[np.number]).columns
if len(numeric_cols) > 1:
    print("\\n🔗 CORRELATION MATRIX")
    print("=" * 50)
    correlation_matrix = df[numeric_cols].corr()
    print(correlation_matrix)

print("\\n✅ Data analysis completed successfully")
`,
      ['pandas', 'numpy']
    );
  }

  /**
   * Generates data visualization code using matplotlib and seaborn
   * 
   * Creates comprehensive visualization dashboards with multiple plot types
   * including distributions, scatter plots, box plots, and categorical charts.
   * Automatically adapts to data types and creates appropriate visualizations.
   * 
   * Generated Visualizations:
   * - Histogram for numeric distributions
   * - Scatter plots for numeric relationships
   * - Box plots for outlier detection
   * - Bar charts for categorical data
   * - Comprehensive dashboard layout
   * 
   * @private
   * @param {string} [data] - Optional CSV data string to visualize
   * @param {any} [params] - Additional parameters for visualization customization
   * @returns {string} Python code for comprehensive data visualization
   * 
   * @example
   * ```typescript
   * const code = this.generateVisualizationCode("x,y\n1,2\n3,4");
   * // Returns complete visualization code with multiple chart types
   * ```
   */
  private generateVisualizationCode(data?: string, params?: any): string {
    return this.wrapWithLibrarySetup(
      `
# Data visualization with matplotlib and seaborn
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Set style
plt.style.use('default')
sns.set_palette("husl")

# Sample or provided data
${
  data
    ? `
# Using provided data
from io import StringIO
try:
    df = pd.read_csv(StringIO("""${data}"""))
    print("✅ Data loaded for visualization")
except:
    df = pd.DataFrame({
        'x': np.random.randn(100),
        'y': np.random.randn(100),
        'category': np.random.choice(['A', 'B', 'C'], 100)
    })
    print("⚠️ Using sample data for visualization")
`
    : `
# Sample dataset
df = pd.DataFrame({
    'sales': np.random.randint(100, 1000, 100),
    'profit': np.random.randint(10, 100, 100),
    'region': np.random.choice(['North', 'South', 'East', 'West'], 100),
    'product': np.random.choice(['A', 'B', 'C'], 100)
})
print("✅ Sample dataset created for visualization")
`
}

# Create comprehensive visualization
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('Data Visualization Dashboard', fontsize=16, fontweight='bold')

# Plot 1: Distribution of first numeric column
numeric_cols = df.select_dtypes(include=[np.number]).columns
if len(numeric_cols) > 0:
    df[numeric_cols[0]].hist(bins=20, ax=axes[0,0], alpha=0.7, color='skyblue')
    axes[0,0].set_title(f'Distribution of {numeric_cols[0]}')
    axes[0,0].set_xlabel(numeric_cols[0])
    axes[0,0].set_ylabel('Frequency')

# Plot 2: Scatter plot if we have 2+ numeric columns
if len(numeric_cols) >= 2:
    categorical_cols = df.select_dtypes(include=['object']).columns
    if len(categorical_cols) > 0:
        for i, cat in enumerate(df[categorical_cols[0]].unique()):
            subset = df[df[categorical_cols[0]] == cat]
            axes[0,1].scatter(subset[numeric_cols[0]], subset[numeric_cols[1]], 
                            label=cat, alpha=0.6)
        axes[0,1].set_title(f'{numeric_cols[0]} vs {numeric_cols[1]}')
        axes[0,1].set_xlabel(numeric_cols[0])
        axes[0,1].set_ylabel(numeric_cols[1])
        axes[0,1].legend()
    else:
        axes[0,1].scatter(df[numeric_cols[0]], df[numeric_cols[1]], alpha=0.6)
        axes[0,1].set_title(f'{numeric_cols[0]} vs {numeric_cols[1]}')

# Plot 3: Box plot
if len(numeric_cols) > 0:
    df.boxplot(column=numeric_cols[0], ax=axes[1,0])
    axes[1,0].set_title(f'Box Plot of {numeric_cols[0]}')

# Plot 4: Categorical distribution
categorical_cols = df.select_dtypes(include=['object']).columns
if len(categorical_cols) > 0:
    df[categorical_cols[0]].value_counts().plot(kind='bar', ax=axes[1,1], color='coral')
    axes[1,1].set_title(f'Distribution of {categorical_cols[0]}')
    axes[1,1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.show()

print("\\n📊 Visualization completed successfully!")
print(f"Dataset shape: {df.shape}")
print(f"Numeric columns: {list(numeric_cols)}")
print(f"Categorical columns: {list(categorical_cols)}")
`,
      ['matplotlib', 'seaborn', 'pandas', 'numpy']
    );
  }

  /**
   * Generates machine learning analysis code using scikit-learn
   * 
   * Creates complete ML workflows including data preprocessing, model training,
   * evaluation, and feature importance analysis. Automatically detects whether
   * to use classification or regression based on target variable characteristics.
   * 
   * Generated ML Pipeline:
   * - Data preprocessing and encoding
   * - Automatic problem type detection (classification vs regression)
   * - Train/test split
   * - Model training (RandomForest)
   * - Performance evaluation with appropriate metrics
   * - Feature importance analysis
   * 
   * @private
   * @param {string} [data] - Optional CSV data string for ML analysis
   * @param {any} [params] - Additional parameters for ML customization
   * @returns {string} Python code for complete machine learning analysis
   * 
   * @example
   * ```typescript
   * const code = this.generateMLCode("feature1,feature2,target\n1,2,0\n3,4,1");
   * // Returns complete ML pipeline with evaluation metrics
   * ```
   */
  private generateMLCode(data?: string, params?: any): string {
    return this.wrapWithLibrarySetup(
      `
# Machine Learning Analysis
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, accuracy_score, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import numpy as np

# Sample or provided data
${
  data
    ? `
# Using provided data
from io import StringIO
try:
    df = pd.read_csv(StringIO("""${data}"""))
    print("✅ Data loaded for ML analysis")
except:
    # Use sample data if parsing fails
    from sklearn.datasets import make_classification
    X, y = make_classification(n_samples=1000, n_features=10, n_classes=2, random_state=42)
    df = pd.DataFrame(X, columns=[f'feature_{i}' for i in range(X.shape[1])])
    df['target'] = y
    print("⚠️ Using sample classification data")
`
    : `
# Sample dataset
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=1000, n_features=10, n_classes=2, random_state=42)
df = pd.DataFrame(X, columns=[f'feature_{i}' for i in range(X.shape[1])])
df['target'] = y
print("✅ Sample classification dataset created")
`
}

print("\\n🤖 MACHINE LEARNING ANALYSIS")
print("=" * 50)
print(f"Dataset shape: {df.shape}")

# Prepare features and target
# Assume last column is target, or find the most suitable target column
target_col = df.columns[-1]
feature_cols = [col for col in df.columns if col != target_col]

X = df[feature_cols]
y = df[target_col]

# Handle categorical variables
categorical_cols = X.select_dtypes(include=['object']).columns
if len(categorical_cols) > 0:
    print(f"Encoding categorical variables: {list(categorical_cols)}")
    le = LabelEncoder()
    for col in categorical_cols:
        X[col] = le.fit_transform(X[col].astype(str))

# Determine if classification or regression
is_classification = len(np.unique(y)) < 20 and y.dtype in ['object', 'int64']

print(f"\\nProblem type: {'Classification' if is_classification else 'Regression'}")
print(f"Features: {X.shape[1]}")
print(f"Samples: {X.shape[0]}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
if is_classification:
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    # Evaluate
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\\n📊 CLASSIFICATION RESULTS")
    print("=" * 30)
    print(f"Accuracy: {accuracy:.4f}")
    print("\\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
else:
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    # Evaluate
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"\\n📊 REGRESSION RESULTS")
    print("=" * 30)
    print(f"Mean Squared Error: {mse:.4f}")
    print(f"R² Score: {r2:.4f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\\n🎯 TOP 10 FEATURE IMPORTANCE")
print("=" * 35)
print(feature_importance.head(10))

print("\\n✅ Machine Learning analysis completed successfully!")
`,
      ['sklearn', 'pandas', 'numpy']
    );
  }

  /**
   * Wraps user code with automatic library installation setup
   * 
   * Prepends user code with library installation and import code that handles
   * missing dependencies automatically. Uses the same library mapping as the
   * basic PythonExecutorTool for consistency.
   * 
   * Library Installation Pattern:
   * - Attempts to import each library
   * - Installs via pip if import fails
   * - Handles common library name mappings
   * - Provides user feedback during installation
   * 
   * @private
   * @param {string} code - The user's Python code to wrap
   * @param {string[]} libraries - Array of library names to install/import
   * @returns {string} Complete Python code with library setup + user code
   * 
   * @example
   * ```typescript
   * const wrappedCode = this.wrapWithLibrarySetup(
   *   "df = pd.DataFrame({'a': [1, 2, 3]})",
   *   ["pandas"]
   * );
   * // Returns: library setup + user code
   * ```
   */
  private wrapWithLibrarySetup(code: string, libraries: string[]): string {
    const setupCode = libraries
      .map(lib => {
        const installMap: Record<string, string> = {
          bs4: 'beautifulsoup4',
          sklearn: 'scikit-learn',
          cv2: 'opencv-python',
        };

        const packageName = installMap[lib] || lib;
        return `
try:
    import ${lib}
except ImportError:
    import subprocess
    import sys
    print(f"📦 Installing {packageName}...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "${packageName}"])
    import ${lib}
    print(f"✅ {packageName} installed successfully")`;
      })
      .join('\n');

    return `# Auto-install required libraries
${setupCode}

${code}`;
  }

  /**
   * Gets the required libraries for a specific operation type
   * 
   * Returns an array of library names that are required for the specified
   * data science operation. This information is used for dependency checking
   * and installation planning.
   * 
   * Library Requirements by Operation:
   * - web_scraping: requests, beautifulsoup4, pandas
   * - data_analysis: pandas, numpy
   * - visualization: matplotlib, seaborn, pandas, numpy
   * - machine_learning: scikit-learn, pandas, numpy
   * - custom: pandas, numpy (basic data science stack)
   * 
   * @private
   * @param {string} operation - The operation type to get libraries for
   * @returns {string[]} Array of required library names
   * 
   * @example
   * ```typescript
   * const libs = this.getRequiredLibraries("machine_learning");
   * // Returns: ["scikit-learn", "pandas", "numpy"]
   * ```
   */
  private getRequiredLibraries(operation: string): string[] {
    const libraryMap: Record<string, string[]> = {
      web_scraping: ['requests', 'beautifulsoup4', 'pandas'],
      data_analysis: ['pandas', 'numpy'],
      visualization: ['matplotlib', 'seaborn', 'pandas', 'numpy'],
      machine_learning: ['scikit-learn', 'pandas', 'numpy'],
      custom: ['pandas', 'numpy'],
    };

    return libraryMap[operation] || [];
  }
}
