// Python Data Analysis Tool Tests - Tests for Python data science operations through MCP IDE
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PythonDataAnalysisTool } from '../../src/tools/python-data-analysis.js';

describe('PythonDataAnalysis Tool', () => {
  let tool: PythonDataAnalysisTool;

  beforeEach(() => {
    tool = new PythonDataAnalysisTool();
    vi.clearAllMocks();
  });

  describe('Tool Definition', () => {
    it('should have correct tool metadata', () => {
      expect(tool.name).toBe('PythonDataAnalysis');
      expect(tool.description).toContain('Execute Python data science operations');
      expect(tool.description).toContain('BeautifulSoup4, pandas, numpy, scipy, scikit-learn, matplotlib');
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.required).toEqual(['operation']);
    });

    it('should have correct input schema structure', () => {
      const schema = tool.inputSchema;
      
      expect(schema.properties).toHaveProperty('operation');
      expect(schema.properties).toHaveProperty('code');
      expect(schema.properties).toHaveProperty('data');
      expect(schema.properties).toHaveProperty('libraries');
      expect(schema.properties).toHaveProperty('output_format');

      expect(schema.properties.operation.enum).toEqual([
        'parse_html', 'parse_xml', 'data_analysis', 'visualization', 'ml_analysis'
      ]);
      expect(schema.properties.output_format.enum).toEqual([
        'text', 'json', 'csv', 'plot'
      ]);
    });
  });

  describe('Input Validation', () => {
    it('should require operation parameter', async () => {
      const args = {};
      const result = await tool.handle(args as any);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Tool Error');
    });

    it('should reject invalid operation', async () => {
      const args = { operation: 'invalid_operation' };
      const result = await tool.handle(args as any);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Unknown operation: invalid_operation');
    });

    it('should handle valid minimal arguments', async () => {
      const args = { operation: 'data_analysis' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.operation).toBe('data_analysis');
      expect(response.generated_code).toBeDefined();
      expect(response.instructions).toContain('MCP IDE executeCode');
    });
  });

  describe('Custom Code Handling', () => {
    it('should use custom code when provided', async () => {
      const customCode = 'df = pd.DataFrame({"test": [1, 2, 3]})\nprint(df.head())';
      const args = { 
        operation: 'data_analysis',
        code: customCode,
        libraries: ['pandas', 'numpy']
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain(customCode);
      expect(response.generated_code).toContain('import pandas as pd');
      expect(response.generated_code).toContain('import numpy as np');
    });

    it('should generate imports for custom libraries', async () => {
      const args = { 
        operation: 'data_analysis',
        code: 'print("test")',
        libraries: ['matplotlib', 'seaborn', 'scipy']
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('import matplotlib.pyplot as plt');
      expect(response.generated_code).toContain('import seaborn as sns');
      expect(response.generated_code).toContain('import scipy');
    });
  });

  describe('HTML Parsing Operation', () => {
    it('should generate HTML parsing code with default data', async () => {
      const args = { operation: 'parse_html' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.operation).toBe('parse_html');
      expect(response.generated_code).toContain('from bs4 import BeautifulSoup');
      expect(response.generated_code).toContain('Sample');
      expect(response.generated_code).toContain('soup.find_all');
      expect(response.libraries_needed).toContain('bs4');
    });

    it('should generate HTML parsing code with custom data', async () => {
      const htmlData = '<html><head><title>Test</title></head><body><h1>Header</h1><p>Paragraph</p></body></html>';
      const args = { 
        operation: 'parse_html',
        data: htmlData
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain(htmlData);
      expect(response.generated_code).toContain('Test');
    });

    it('should handle JSON output format for HTML parsing', async () => {
      const args = { 
        operation: 'parse_html',
        output_format: 'json'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('json.dumps(results, indent=2)');
    });
  });

  describe('XML Parsing Operation', () => {
    it('should generate XML parsing code with default data', async () => {
      const args = { operation: 'parse_xml' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.operation).toBe('parse_xml');
      expect(response.generated_code).toContain('from lxml import etree');
      expect(response.generated_code).toContain('<root><item>Sample</item></root>');
      expect(response.libraries_needed).toContain('lxml');
    });

    it('should generate XML parsing code with custom data', async () => {
      const xmlData = '<catalog><book id="1"><title>Book Title</title><author>Author Name</author></book></catalog>';
      const args = { 
        operation: 'parse_xml',
        data: xmlData,
        output_format: 'json'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain(xmlData);
      expect(response.generated_code).toContain('json.dumps(results, indent=2)');
    });
  });

  describe('Data Analysis Operation', () => {
    it('should generate data analysis code with default data', async () => {
      const args = { operation: 'data_analysis' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.operation).toBe('data_analysis');
      expect(response.generated_code).toContain('import pandas as pd');
      expect(response.generated_code).toContain('import numpy as np');
      expect(response.generated_code).toContain('np.random.randn');
      expect(response.generated_code).toContain('df.describe()');
      expect(response.libraries_needed).toEqual(['pandas', 'numpy']);
    });

    it('should generate data analysis code with provided CSV data', async () => {
      const csvData = 'name,age,salary\\nJohn,25,50000\\nJane,30,60000\\nBob,35,70000';
      const args = { 
        operation: 'data_analysis',
        data: csvData,
        output_format: 'json'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain(csvData);
      expect(response.generated_code).toContain('pd.read_csv(StringIO(data))');
      expect(response.generated_code).toContain('json.dumps(analysis, indent=2, default=str)');
    });
  });

  describe('Visualization Operation', () => {
    it('should generate visualization code with default data', async () => {
      const args = { operation: 'visualization' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.operation).toBe('visualization');
      expect(response.generated_code).toContain('import matplotlib.pyplot as plt');
      expect(response.generated_code).toContain('plt.scatter');
      expect(response.generated_code).toContain('plt.savefig("output.png")');
      expect(response.libraries_needed).toEqual(['matplotlib', 'pandas', 'numpy']);
    });

    it('should generate visualization code with plot output format', async () => {
      const args = { 
        operation: 'visualization',
        output_format: 'plot'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('plt.show()');
    });

    it('should generate visualization code with save output format', async () => {
      const args = { 
        operation: 'visualization',
        output_format: 'text'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('plt.savefig("output.png")');
    });

    it('should handle provided data in visualization', async () => {
      const csvData = 'x,y,category\\n1,2,A\\n3,4,B\\n5,6,C';
      const args = { 
        operation: 'visualization',
        data: csvData
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('# Using provided data');
    });
  });

  describe('Machine Learning Operation', () => {
    it('should generate ML analysis code with default data', async () => {
      const args = { operation: 'ml_analysis' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.operation).toBe('ml_analysis');
      expect(response.generated_code).toContain('from sklearn.model_selection import train_test_split');
      expect(response.generated_code).toContain('RandomForestClassifier');
      expect(response.generated_code).toContain('accuracy_score');
      expect(response.generated_code).toContain('make_classification');
      expect(response.libraries_needed).toEqual(['sklearn', 'pandas', 'numpy']);
    });

    it('should generate ML analysis with JSON output format', async () => {
      const args = { 
        operation: 'ml_analysis',
        output_format: 'json'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('json.dumps(results, indent=2, default=str)');
    });

    it('should handle provided data in ML analysis', async () => {
      const csvData = 'feature1,feature2,target\\n1,2,0\\n3,4,1\\n5,6,0';
      const args = { 
        operation: 'ml_analysis',
        data: csvData
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('# Using provided data');
    });
  });

  describe('Library Requirements', () => {
    it('should return correct libraries for each operation', () => {
      const operations = [
        { op: 'parse_html', expected: ['bs4'] },
        { op: 'parse_xml', expected: ['lxml'] },
        { op: 'data_analysis', expected: ['pandas', 'numpy'] },
        { op: 'visualization', expected: ['matplotlib', 'pandas', 'numpy'] },
        { op: 'ml_analysis', expected: ['sklearn', 'pandas', 'numpy'] }
      ];

      for (const { op, expected } of operations) {
        const result = (tool as any).getRequiredLibraries(op);
        expect(result).toEqual(expected);
      }
    });

    it('should return custom libraries when provided', () => {
      const customLibs = ['custom1', 'custom2'];
      const result = (tool as any).getRequiredLibraries('data_analysis', customLibs);
      expect(result).toEqual(customLibs);
    });

    it('should return empty array for unknown operation', () => {
      const result = (tool as any).getRequiredLibraries('unknown_operation');
      expect(result).toEqual([]);
    });
  });

  describe('Import Generation', () => {
    it('should generate correct imports for standard libraries', () => {
      const libraries = ['bs4', 'pandas', 'numpy', 'matplotlib', 'sklearn'];
      const result = (tool as any).generateImports(libraries);
      
      expect(result).toContain('from bs4 import BeautifulSoup');
      expect(result).toContain('import pandas as pd');
      expect(result).toContain('import numpy as np');
      expect(result).toContain('import matplotlib.pyplot as plt');
      expect(result).toContain('import sklearn');
    });

    it('should handle unknown libraries with basic import', () => {
      const libraries = ['custom_library', 'another_lib'];
      const result = (tool as any).generateImports(libraries);
      
      expect(result).toContain('import custom_library');
      expect(result).toContain('import another_lib');
    });

    it('should generate seaborn import correctly', () => {
      const libraries = ['seaborn'];
      const result = (tool as any).generateImports(libraries);
      
      expect(result).toContain('import seaborn as sns');
    });
  });

  describe('Response Format', () => {
    it('should return properly formatted response', async () => {
      const args = { operation: 'data_analysis' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      
      expect(response).toHaveProperty('operation');
      expect(response).toHaveProperty('generated_code');
      expect(response).toHaveProperty('instructions');
      expect(response).toHaveProperty('libraries_needed');
      
      expect(response.operation).toBe('data_analysis');
      expect(typeof response.generated_code).toBe('string');
      expect(response.instructions).toContain('MCP IDE executeCode');
      expect(Array.isArray(response.libraries_needed)).toBe(true);
    });

    it('should include correct libraries in response', async () => {
      const args = { 
        operation: 'parse_html',
        libraries: ['bs4', 'pandas']
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.libraries_needed).toEqual(['bs4', 'pandas']);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      // Mock validateArgs to throw an error
      vi.spyOn(tool as any, 'validateArgs').mockImplementation(() => {
        throw new Error('Validation failed');
      });

      const args = { operation: 'data_analysis' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Validation failed');
    });

    it('should handle non-Error exceptions', async () => {
      // Mock validateArgs to throw a string
      vi.spyOn(tool as any, 'validateArgs').mockImplementation(() => {
        throw 'String error occurred';
      });

      const args = { operation: 'visualization' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('String error occurred');
    });

    it('should handle code generation errors', async () => {
      // Mock generatePythonCode to throw an error
      vi.spyOn(tool as any, 'generatePythonCode').mockImplementation(() => {
        throw new Error('Code generation failed');
      });

      const args = { operation: 'ml_analysis' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Code generation failed');
    });
  });

  describe('Output Format Handling', () => {
    const operations = ['parse_html', 'parse_xml', 'data_analysis', 'ml_analysis'];
    const formats = ['text', 'json'];

    operations.forEach(operation => {
      formats.forEach(format => {
        it(`should handle ${format} output for ${operation}`, async () => {
          const args = { 
            operation: operation as any,
            output_format: format as any
          };
          const result = await tool.handle(args);
          
          expect(result.isError).toBe(false);
          const response = JSON.parse(result.content[0].text);
          
          if (format === 'json') {
            expect(response.generated_code).toContain('json.dumps');
          } else {
            expect(response.generated_code).toContain('print(');
          }
        });
      });
    });

    it('should handle plot output format for visualization', async () => {
      const args = { 
        operation: 'visualization',
        output_format: 'plot'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('plt.show()');
    });
  });
});