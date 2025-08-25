/**
 * Python Computational Tool
 *
 * Unified Python execution and data science tool that consolidates all Python-related
 * capabilities into a single, comprehensive interface. This tool handles everything from
 * basic Python execution to complex data science workflows with automatic library
 * management and code generation.
 *
 * The tool includes:
 * - Basic Python code execution with library management
 * - Complete data science workflows with auto-generated code
 * - Web scraping, data analysis, visualization, and machine learning
 * - Custom code execution with proper error handling
 *
 * Integration Pattern:
 * 1. Tool prepares Python code with library setup
 * 2. Code is formatted for MCP IDE executeCode tool
 * 3. Libraries are auto-installed using pip if missing
 * 4. Execution happens in persistent Jupyter kernel
 *
 * @fileoverview Unified Python computational tool for Iron Manus MCP
 * @author Iron Manus MCP Team
 * @version 2.0.0
 */

import { BaseTool, ToolResult, ToolSchema } from '../base-tool.js';
import {
  EnhancedPythonDataScienceArgsSchema,
  type EnhancedPythonDataScienceArgs,
} from '../../validation/schemas.js';
import {
  validatePythonCode,
  isValidLibraryName,
  ALLOWED_LIBRARIES,
} from '../../utils/python-security.js';

/**
 * Python Computational Tool
 *
 * Comprehensive computational tool that combines intelligent code generation with execution
 * instructions for all Python-related operations. This tool generates complete, ready-to-run
 * Python code for various computational and data science operations.
 *
 * Supported Operations:
 * - web_scraping: Extract data from websites using BeautifulSoup and requests
 * - data_analysis: Comprehensive data analysis with pandas and numpy
 * - visualization: Create charts and plots with matplotlib and seaborn
 * - machine_learning: Build and evaluate ML models with scikit-learn
 * - custom: Execute user-provided custom Python code with library management
 *
 * Key Features:
 * - Auto-generates complete, production-ready code
 * - Handles library installation automatically
 * - Provides comprehensive error handling
 * - Includes detailed output and logging
 * - Supports both specialized workflows and general Python execution
 * - Template-based code generation for common patterns
 * - Security validation and library allowlisting
 *
 * Usage Examples:
 * ```typescript
 * // Data analysis
 * const result = await tool.handle({
 *   operation: 'data_analysis',
 *   input_data: csvData,
 *   parameters: { analysis_type: 'descriptive' }
 * });
 *
 * // Custom code execution
 * const result = await tool.handle({
 *   operation: 'custom',
 *   custom_code: 'print("Hello from Python!")',
 *   parameters: { libraries: ['numpy', 'pandas'] }
 * });
 * ```
 *
 * @class PythonComputationalTool
 * @extends BaseTool
 * @implements Metaprompting-first design principles
 */
export class PythonComputationalTool extends BaseTool {
  name = 'PythonComputationalTool';
  description =
    'Unified Python execution and data science tool with automatic library management and comprehensive workflow support';

  inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['web_scraping', 'data_analysis', 'visualization', 'machine_learning', 'custom'],
        description: 'Type of computational operation to perform',
      },
      input_data: {
        type: 'string',
        description: 'Input data as string (HTML, XML, CSV, JSON, etc.)',
      },
      parameters: {
        type: 'object',
        description: 'Operation-specific parameters and configuration',
      },
      custom_code: {
        type: 'string',
        description: 'Custom Python code to execute (for custom operation)',
      },
    },
    required: ['operation'],
  };

  async handle(args: unknown): Promise<ToolResult> {
    // Validate basic structure
    this.validateArgs(args);

    // Parse and validate with Zod schema
    const parseResult = EnhancedPythonDataScienceArgsSchema.safeParse(args);
    if (!parseResult.success) {
      throw new Error(`Invalid arguments: ${parseResult.error.message}`);
    }

    const { operation, input_data, parameters, custom_code } = parseResult.data;

    try {
      let generatedCode: string;
      let requiredLibraries: string[] = [];

      switch (operation) {
        case 'web_scraping':
          generatedCode = this.generateWebScrapingCode(input_data, parameters);
          requiredLibraries = ['requests', 'bs4', 'lxml', 'pandas'];
          break;

        case 'data_analysis':
          generatedCode = this.generateDataAnalysisCode(input_data, parameters);
          requiredLibraries = ['pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn'];
          break;

        case 'visualization':
          generatedCode = this.generateVisualizationCode(input_data, parameters);
          requiredLibraries = ['matplotlib', 'seaborn', 'pandas', 'numpy', 'plotly'];
          break;

        case 'machine_learning':
          generatedCode = this.generateMLCode(input_data, parameters);
          requiredLibraries = ['sklearn', 'pandas', 'numpy', 'matplotlib', 'seaborn'];
          break;

        case 'custom': {
          if (!custom_code) {
            throw new Error('custom_code is required for custom operation');
          }

          // Security validation for custom code
          validatePythonCode(custom_code);

          generatedCode = custom_code;
          // Extract libraries from parameters if provided
          const paramLibraries = (parameters?.libraries as string[]) || [];
          requiredLibraries = paramLibraries.filter(lib =>
            isValidLibraryName(lib, ALLOWED_LIBRARIES)
          );
          break;
        }

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }

      // Wrap code with library setup
      const finalCode = this.wrapWithLibrarySetup(generatedCode, requiredLibraries);

      return this.createResponse(
        JSON.stringify(
          {
            operation,
            generated_code: finalCode,
            execution_ready: true,
            instructions:
              'Use mcp__ide__executeCode tool to run this Python code in the Jupyter kernel',
            required_libraries: requiredLibraries,
          },
          null,
          2
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return this.createErrorResponse(`PythonComputationalTool execution failed: ${errorMessage}`);
    }
  }

  /**
   * Generates web scraping code for extracting data from websites
   */
  private generateWebScrapingCode(url: string = '', parameters: any = {}): string {
    const { selector, output_format = 'json' } = parameters;

    return `
# Web Scraping Script
import requests
from bs4 import BeautifulSoup
import pandas as pd
import json

# Fetch webpage
url = "${url}"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

response = requests.get(url, headers=headers)
response.raise_for_status()

# Parse HTML
soup = BeautifulSoup(response.content, 'html.parser')

# Extract data
${
  selector
    ? `
# Using provided CSS selector
elements = soup.select("${selector}")
data = [elem.get_text(strip=True) for elem in elements]
`
    : `
# Extract common elements
titles = [elem.get_text(strip=True) for elem in soup.find_all(['h1', 'h2', 'h3'])]
links = [a.get('href') for a in soup.find_all('a', href=True)]
paragraphs = [p.get_text(strip=True) for p in soup.find_all('p')]

data = {
    'titles': titles,
    'links': links,
    'paragraphs': paragraphs
}
`
}

# Output results
${
  output_format === 'csv'
    ? `
df = pd.DataFrame(data)
print("Data extracted and converted to DataFrame:")
print(df.head())
df.to_csv('scraped_data.csv', index=False)
print("Data saved to scraped_data.csv")
`
    : `
print("Extracted data:")
print(json.dumps(data, indent=2, ensure_ascii=False))
`
}
`;
  }

  /**
   * Generates comprehensive data analysis code
   */
  private generateDataAnalysisCode(data: string = '', parameters: any = {}): string {
    const { analysis_type = 'descriptive', target_column } = parameters;

    return `
# Data Analysis Script
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Load data
${
  data
    ? `
# Parse provided data
data_str = '''${data}'''
try:
    # Try JSON first
    import json
    data_dict = json.loads(data_str)
    df = pd.DataFrame(data_dict)
except:
    try:
        # Try CSV format
        from io import StringIO
        df = pd.read_csv(StringIO(data_str))
    except:
        print("Could not parse data. Please provide valid JSON or CSV format.")
        df = pd.DataFrame()
`
    : `
# Load from file (modify path as needed)
df = pd.read_csv('data.csv')  # Replace with actual file path
`
}

if not df.empty:
    print("Dataset Overview:")
    print(f"Shape: {df.shape}")
    print("\\nColumn Info:")
    print(df.info())
    
    print("\\nFirst 5 rows:")
    print(df.head())
    
    print("\\nDescriptive Statistics:")
    print(df.describe())
    
    # Missing values analysis
    print("\\nMissing Values:")
    missing = df.isnull().sum()
    print(missing[missing > 0])
    
    ${
      analysis_type === 'correlation'
        ? `
    # Correlation Analysis
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 1:
        correlation_matrix = df[numeric_cols].corr()
        print("\\nCorrelation Matrix:")
        print(correlation_matrix)
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
        plt.title('Correlation Heatmap')
        plt.tight_layout()
        plt.show()
    `
        : `
    # Advanced Analysis
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    categorical_cols = df.select_dtypes(include=['object']).columns
    
    print(f"\\nNumeric columns: {list(numeric_cols)}")
    print(f"Categorical columns: {list(categorical_cols)}")
    
    # Distribution analysis for numeric columns
    for col in numeric_cols[:3]:  # Limit to first 3 numeric columns
        plt.figure(figsize=(12, 4))
        
        plt.subplot(1, 2, 1)
        df[col].hist(bins=30, alpha=0.7)
        plt.title(f'Distribution of {col}')
        plt.xlabel(col)
        plt.ylabel('Frequency')
        
        plt.subplot(1, 2, 2)
        df.boxplot(column=col)
        plt.title(f'Box Plot of {col}')
        
        plt.tight_layout()
        plt.show()
        
        # Statistical tests
        print(f"\\nStatistics for {col}:")
        print(f"Mean: {df[col].mean():.2f}")
        print(f"Median: {df[col].median():.2f}")
        print(f"Std Dev: {df[col].std():.2f}")
        print(f"Skewness: {df[col].skew():.2f}")
    `
    }
    
    ${
      target_column
        ? `
    # Target variable analysis
    target = "${target_column}"
    if target in df.columns:
        print(f"\\nTarget Variable Analysis: {target}")
        if df[target].dtype in ['object', 'category']:
            print(df[target].value_counts())
            df[target].value_counts().plot(kind='bar')
            plt.title(f'Distribution of {target}')
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.show()
        else:
            print(df[target].describe())
    `
        : ''
    }
    
else:
    print("No data available for analysis.")
`;
  }

  /**
   * Generates visualization code for data
   */
  private generateVisualizationCode(data: string = '', parameters: any = {}): string {
    const { chart_type = 'scatter', x_column, y_column } = parameters;

    return `
# Data Visualization Script
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Set style
plt.style.use('default')
sns.set_palette("husl")

# Load data
${
  data
    ? `
# Parse provided data
data_str = '''${data}'''
try:
    import json
    data_dict = json.loads(data_str)
    df = pd.DataFrame(data_dict)
except:
    from io import StringIO
    df = pd.read_csv(StringIO(data_str))
`
    : `
df = pd.read_csv('data.csv')  # Replace with actual file path
`
}

if not df.empty:
    print(f"Creating {chart_type} visualization...")
    
    ${
      chart_type === 'scatter' && x_column && y_column
        ? `
    # Scatter plot
    plt.figure(figsize=(10, 6))
    plt.scatter(df['${x_column}'], df['${y_column}'], alpha=0.7)
    plt.xlabel('${x_column}')
    plt.ylabel('${y_column}')
    plt.title('${x_column} vs ${y_column}')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()
    `
        : `
    # Auto-generate visualizations based on data types
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    categorical_cols = df.select_dtypes(include=['object']).columns
    
    # Correlation heatmap for numeric data
    if len(numeric_cols) > 1:
        plt.figure(figsize=(10, 8))
        correlation_matrix = df[numeric_cols].corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
        plt.title('Correlation Heatmap')
        plt.tight_layout()
        plt.show()
    
    # Distribution plots for numeric columns
    if len(numeric_cols) > 0:
        fig, axes = plt.subplots(min(len(numeric_cols), 4), 1, figsize=(12, 3*min(len(numeric_cols), 4)))
        if len(numeric_cols) == 1:
            axes = [axes]
        
        for i, col in enumerate(numeric_cols[:4]):
            df[col].hist(bins=30, alpha=0.7, ax=axes[i])
            axes[i].set_title(f'Distribution of {col}')
            axes[i].set_xlabel(col)
            axes[i].set_ylabel('Frequency')
        
        plt.tight_layout()
        plt.show()
    
    # Bar plots for categorical columns
    if len(categorical_cols) > 0:
        for col in categorical_cols[:3]:  # Limit to first 3
            plt.figure(figsize=(10, 6))
            value_counts = df[col].value_counts().head(10)  # Top 10 values
            value_counts.plot(kind='bar')
            plt.title(f'Distribution of {col}')
            plt.xlabel(col)
            plt.ylabel('Count')
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.show()
    `
    }
    
else:
    print("No data available for visualization.")
`;
  }

  /**
   * Generates machine learning code
   */
  private generateMLCode(data: string = '', parameters: any = {}): string {
    const { model_type = 'classification', target_column, test_size = 0.2 } = parameters;

    return `
# Machine Learning Script
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns

${
  model_type === 'classification'
    ? `
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
`
    : `
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
`
}

# Load data
${
  data
    ? `
# Parse provided data
data_str = '''${data}'''
try:
    import json
    data_dict = json.loads(data_str)
    df = pd.DataFrame(data_dict)
except:
    from io import StringIO
    df = pd.read_csv(StringIO(data_str))
`
    : `
df = pd.read_csv('data.csv')  # Replace with actual file path
`
}

if not df.empty and "${target_column}" in df.columns:
    print("Preparing data for machine learning...")
    
    # Separate features and target
    target = "${target_column}"
    X = df.drop(columns=[target])
    y = df[target]
    
    # Handle categorical variables
    categorical_cols = X.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
    
    # Handle missing values
    X = X.fillna(X.mean())
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=${test_size}, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print(f"Training set size: {X_train.shape}")
    print(f"Test set size: {X_test.shape}")
    
    ${
      model_type === 'classification'
        ? `
    # Classification models
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
        'SVM': SVC(random_state=42)
    }
    
    results = {}
    for name, model in models.items():
        print(f"\\nTraining {name}...")
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        
        accuracy = model.score(X_test_scaled, y_test)
        results[name] = accuracy
        
        print(f"{name} Accuracy: {accuracy:.4f}")
        print(f"Classification Report for {name}:")
        print(classification_report(y_test, y_pred))
    
    # Plot results
    plt.figure(figsize=(10, 6))
    models_names = list(results.keys())
    accuracies = list(results.values())
    plt.bar(models_names, accuracies)
    plt.title('Model Comparison - Accuracy')
    plt.ylabel('Accuracy')
    plt.ylim(0, 1)
    for i, v in enumerate(accuracies):
        plt.text(i, v + 0.01, f'{v:.3f}', ha='center')
    plt.tight_layout()
    plt.show()
    `
        : `
    # Regression models
    models = {
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
        'Linear Regression': LinearRegression(),
        'SVR': SVR()
    }
    
    results = {}
    for name, model in models.items():
        print(f"\\nTraining {name}...")
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        results[name] = {'MSE': mse, 'R2': r2}
        
        print(f"{name} - MSE: {mse:.4f}, R²: {r2:.4f}")
    
    # Plot results
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    # MSE comparison
    models_names = list(results.keys())
    mse_values = [results[name]['MSE'] for name in models_names]
    ax1.bar(models_names, mse_values)
    ax1.set_title('Model Comparison - MSE')
    ax1.set_ylabel('Mean Squared Error')
    
    # R² comparison
    r2_values = [results[name]['R2'] for name in models_names]
    ax2.bar(models_names, r2_values)
    ax2.set_title('Model Comparison - R²')
    ax2.set_ylabel('R² Score')
    
    plt.tight_layout()
    plt.show()
    `
    }
    
else:
    print("No data available or target column not found.")
    ${target_column ? `print(f"Target column '{target_column}' not found in data.")` : 'print("Please specify target_column in parameters.")'}
`;
  }

  /**
   * Wraps generated code with library setup
   */
  private wrapWithLibrarySetup(code: string, libraries: string[]): string {
    if (libraries.length === 0) {
      return code;
    }

    const librarySetup = this.generateLibrarySetup(libraries);
    return `${librarySetup}\n\n${code}`;
  }

  /**
   * Generates Python code for automatic library installation and import
   */
  private generateLibrarySetup(libraries: string[]): string {
    const installCode = libraries
      .map(lib => {
        // Security: Validate library name against allowlist
        if (!isValidLibraryName(lib, ALLOWED_LIBRARIES)) {
          throw new Error(`Security: Invalid or dangerous library name: ${lib}`);
        }

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
