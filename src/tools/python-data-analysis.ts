/**
 * Python Data Analysis Tool
 * Integrates Python data science libraries through MCP IDE execute code
 */

import { BaseTool, ToolResult, ToolSchema } from './base-tool.js';

export interface PythonDataAnalysisArgs {
  operation: 'parse_html' | 'parse_xml' | 'data_analysis' | 'visualization' | 'ml_analysis';
  code?: string;
  data?: string;
  libraries?: string[];
  output_format?: 'text' | 'json' | 'csv' | 'plot';
}

/**
 * Python Data Analysis Tool
 * Executes Python data science operations using available libraries
 */
export class PythonDataAnalysisTool extends BaseTool {
  readonly name = 'PythonDataAnalysis';
  readonly description =
    'Execute Python data science operations using BeautifulSoup4, pandas, numpy, scipy, scikit-learn, matplotlib through MCP IDE';

  readonly inputSchema: ToolSchema = {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['parse_html', 'parse_xml', 'data_analysis', 'visualization', 'ml_analysis'],
        description: 'Type of data science operation to perform',
      },
      code: {
        type: 'string',
        description: 'Custom Python code to execute (optional)',
      },
      data: {
        type: 'string',
        description: 'Input data as string (HTML, XML, CSV, JSON, etc.)',
      },
      libraries: {
        type: 'array',
        items: { type: 'string' },
        description:
          'Python libraries to import (bs4, pandas, numpy, scipy, sklearn, matplotlib, etc.)',
      },
      output_format: {
        type: 'string',
        enum: ['text', 'json', 'csv', 'plot'],
        description: 'Desired output format',
      },
    },
    required: ['operation'],
    additionalProperties: false,
  };

  async handle(args: PythonDataAnalysisArgs): Promise<ToolResult> {
    try {
      this.validateArgs(args);

      // Generate Python code based on operation
      const pythonCode = this.generatePythonCode(args);

      // Execute through MCP IDE (this would need to be available in the MCP context)
      // For now, we'll return the generated code that could be executed

      return this.createResponse(
        JSON.stringify(
          {
            operation: args.operation,
            generated_code: pythonCode,
            instructions: 'Execute this Python code using the MCP IDE executeCode tool',
            libraries_needed: this.getRequiredLibraries(args.operation, args.libraries),
          },
          null,
          2
        )
      );
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private generatePythonCode(args: PythonDataAnalysisArgs): string {
    const { operation, data, libraries, output_format, code } = args;

    // If custom code provided, use it with imports
    if (code) {
      const imports = this.generateImports(libraries || this.getRequiredLibraries(operation));
      return `${imports}\n\n${code}`;
    }

    // Generate code based on operation type
    switch (operation) {
      case 'parse_html':
        return this.generateHtmlParsingCode(data, output_format);

      case 'parse_xml':
        return this.generateXmlParsingCode(data, output_format);

      case 'data_analysis':
        return this.generateDataAnalysisCode(data, output_format);

      case 'visualization':
        return this.generateVisualizationCode(data, output_format);

      case 'ml_analysis':
        return this.generateMLAnalysisCode(data, output_format);

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private generateImports(libraries: string[]): string {
    const importMap: Record<string, string> = {
      bs4: 'from bs4 import BeautifulSoup',
      lxml: 'import lxml',
      pandas: 'import pandas as pd',
      numpy: 'import numpy as np',
      scipy: 'import scipy',
      sklearn: 'import sklearn',
      matplotlib: 'import matplotlib.pyplot as plt',
      seaborn: 'import seaborn as sns',
    };

    return libraries.map(lib => importMap[lib] || `import ${lib}`).join('\n');
  }

  private generateHtmlParsingCode(data?: string, outputFormat?: string): string {
    return `
from bs4 import BeautifulSoup
import json

# Sample HTML data
html_data = """${data || '<html><body><h1>Sample</h1><p>Text</p></body></html>'}"""

# Parse HTML
soup = BeautifulSoup(html_data, 'html.parser')

# Extract data
results = {
    'title': soup.find('title').text if soup.find('title') else 'No title',
    'headings': [h.text for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])],
    'paragraphs': [p.text for p in soup.find_all('p')],
    'links': [{'text': a.text, 'href': a.get('href')} for a in soup.find_all('a')]
}

# Output results
${outputFormat === 'json' ? 'print(json.dumps(results, indent=2))' : 'print(results)'}
`;
  }

  private generateXmlParsingCode(data?: string, outputFormat?: string): string {
    return `
from lxml import etree
import json

# Sample XML data
xml_data = """${data || '<root><item>Sample</item></root>'}"""

# Parse XML
root = etree.fromstring(xml_data)

# Extract data
results = {}
for elem in root.iter():
    if elem.text and elem.text.strip():
        results[elem.tag] = elem.text.strip()

# Output results
${outputFormat === 'json' ? 'print(json.dumps(results, indent=2))' : 'print(results)'}
`;
  }

  private generateDataAnalysisCode(data?: string, outputFormat?: string): string {
    return `
import pandas as pd
import numpy as np

# Sample data or load from input
${
  data
    ? `data = """${data}"""`
    : `data = pd.DataFrame({
    'A': np.random.randn(100),
    'B': np.random.randn(100),
    'C': np.random.randint(1, 5, 100)
})`
}

# Basic analysis
if isinstance(data, str):
    # Try to parse as CSV
    from io import StringIO
    df = pd.read_csv(StringIO(data))
else:
    df = data

# Perform analysis
analysis = {
    'shape': df.shape,
    'columns': df.columns.tolist(),
    'dtypes': df.dtypes.to_dict(),
    'summary': df.describe().to_dict(),
    'missing_values': df.isnull().sum().to_dict()
}

# Output results
${outputFormat === 'json' ? 'import json; print(json.dumps(analysis, indent=2, default=str))' : 'print(analysis)'}
`;
  }

  private generateVisualizationCode(data?: string, outputFormat?: string): string {
    return `
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Sample data
${
  data
    ? `# Using provided data`
    : `data = pd.DataFrame({
    'x': np.random.randn(100),
    'y': np.random.randn(100),
    'category': np.random.choice(['A', 'B', 'C'], 100)
})`
}

# Create visualization
plt.figure(figsize=(10, 6))
plt.scatter(data['x'], data['y'], c=data['category'].astype('category').cat.codes, alpha=0.6)
plt.xlabel('X values')
plt.ylabel('Y values')
plt.title('Sample Data Visualization')
plt.colorbar()

# Save or display
plt.tight_layout()
${outputFormat === 'plot' ? 'plt.show()' : 'plt.savefig("output.png"); print("Plot saved as output.png")'}
`;
  }

  private generateMLAnalysisCode(data?: string, outputFormat?: string): string {
    return `
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Sample data
${
  data
    ? `# Using provided data`
    : `from sklearn.datasets import make_classification
X, y = make_classification(n_samples=1000, n_features=10, n_classes=2, random_state=42)`
}

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, output_dict=True)

results = {
    'accuracy': accuracy,
    'classification_report': report,
    'feature_importance': model.feature_importances_.tolist()
}

# Output results
${outputFormat === 'json' ? 'import json; print(json.dumps(results, indent=2, default=str))' : 'print(f"Accuracy: {accuracy:.4f}"); print(report)'}
`;
  }

  private getRequiredLibraries(operation: string, customLibraries?: string[]): string[] {
    if (customLibraries) return customLibraries;

    const libraryMap: Record<string, string[]> = {
      parse_html: ['bs4'],
      parse_xml: ['lxml'],
      data_analysis: ['pandas', 'numpy'],
      visualization: ['matplotlib', 'pandas', 'numpy'],
      ml_analysis: ['sklearn', 'pandas', 'numpy'],
    };

    return libraryMap[operation] || [];
  }
}
