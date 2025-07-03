// Python Executor Tool Tests - Tests for Python code execution with data science libraries
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PythonExecutorTool, EnhancedPythonDataScienceTool } from '../../src/tools/python-executor.js';

describe('PythonExecutor Tool', () => {
  let tool: PythonExecutorTool;

  beforeEach(() => {
    tool = new PythonExecutorTool();
    vi.clearAllMocks();
  });

  describe('Tool Definition', () => {
    it('should have correct tool metadata', () => {
      expect(tool.name).toBe('PythonExecutor');
      expect(tool.description).toContain('Execute Python code');
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.required).toEqual(['code']);
    });

    it('should have correct input schema structure', () => {
      const schema = tool.inputSchema;
      
      expect(schema.properties).toHaveProperty('code');
      expect(schema.properties).toHaveProperty('setup_libraries');
      expect(schema.properties).toHaveProperty('description');

      expect(schema.properties.code.type).toBe('string');
      expect(schema.properties.setup_libraries.type).toBe('array');
      expect(schema.properties.description.type).toBe('string');
    });
  });

  describe('Input Validation', () => {
    it('should require code parameter', async () => {
      const args = {};
      const result = await tool.handle(args as any);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Tool Error');
    });

    it('should handle valid minimal arguments', async () => {
      const args = { code: 'print("Hello, World!")' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.action).toBe('execute_python');
      expect(response.prepared_code).toContain('print("Hello, World!")');
    });
  });

  describe('Code Preparation', () => {
    it('should prepare simple code without libraries', async () => {
      const args = { 
        code: 'x = 1 + 1\nprint(x)',
        description: 'Simple math calculation'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.prepared_code).toBe('x = 1 + 1\nprint(x)');
      expect(response.description).toBe('Simple math calculation');
      expect(response.next_step).toContain('mcp__ide__executeCode');
    });

    it('should setup single library', async () => {
      const args = { 
        code: 'import pandas as pd\ndf = pd.DataFrame({"A": [1, 2, 3]})',
        setup_libraries: ['pandas']
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.prepared_code).toContain('import pandas');
      expect(response.prepared_code).toContain('subprocess.check_call');
      expect(response.prepared_code).toContain('df = pd.DataFrame');
      expect(response.libraries_to_check).toEqual(['pandas']);
    });

    it('should setup multiple libraries', async () => {
      const args = { 
        code: 'import numpy as np\nimport pandas as pd',
        setup_libraries: ['numpy', 'pandas', 'matplotlib']
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.prepared_code).toContain('import numpy');
      expect(response.prepared_code).toContain('import pandas');
      expect(response.prepared_code).toContain('import matplotlib');
      expect(response.libraries_to_check).toEqual(['numpy', 'pandas', 'matplotlib']);
    });

    it('should handle library mapping for common packages', async () => {
      const args = { 
        code: 'from bs4 import BeautifulSoup',
        setup_libraries: ['bs4', 'sklearn', 'cv2']
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.prepared_code).toContain('beautifulsoup4');
      expect(response.prepared_code).toContain('scikit-learn');
      expect(response.prepared_code).toContain('opencv-python');
    });

    it('should include success message for library setup', async () => {
      const args = { 
        code: 'print("test")',
        setup_libraries: ['pandas']
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.prepared_code).toContain('All required libraries loaded successfully');
    });
  });

  describe('Error Handling', () => {
    it('should handle string errors', async () => {
      // Mock validateArgs to throw a string error
      vi.spyOn(tool as any, 'validateArgs').mockImplementation(() => {
        throw 'String error';
      });

      const args = { code: 'print("test")' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('String error');
    });

    it('should handle Error objects', async () => {
      // Mock validateArgs to throw an Error
      vi.spyOn(tool as any, 'validateArgs').mockImplementation(() => {
        throw new Error('Validation failed');
      });

      const args = { code: 'print("test")' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Validation failed');
    });
  });
});

describe('EnhancedPythonDataScience Tool', () => {
  let tool: EnhancedPythonDataScienceTool;

  beforeEach(() => {
    tool = new EnhancedPythonDataScienceTool();
    vi.clearAllMocks();
  });

  describe('Tool Definition', () => {
    it('should have correct tool metadata', () => {
      expect(tool.name).toBe('EnhancedPythonDataScience');
      expect(tool.description).toContain('Complete Python data science operations');
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.required).toEqual(['operation']);
    });

    it('should have correct operation enum values', () => {
      const schema = tool.inputSchema;
      const operationEnum = schema.properties.operation.enum;
      
      expect(operationEnum).toContain('web_scraping');
      expect(operationEnum).toContain('data_analysis');
      expect(operationEnum).toContain('visualization');
      expect(operationEnum).toContain('machine_learning');
      expect(operationEnum).toContain('custom');
    });
  });

  describe('Input Validation', () => {
    it('should require operation parameter', async () => {
      const args = {};
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Tool Error');
    });

    it('should reject invalid operation', async () => {
      const args = { operation: 'invalid_operation' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Unknown operation');
    });
  });

  describe('Web Scraping Operation', () => {
    it('should generate web scraping code with default URL', async () => {
      const args = { operation: 'web_scraping' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.operation).toBe('web_scraping');
      expect(response.generated_code).toContain('requests');
      expect(response.generated_code).toContain('BeautifulSoup');
      expect(response.generated_code).toContain('https://example.com');
      expect(response.required_libraries).toContain('requests');
      expect(response.required_libraries).toContain('beautifulsoup4');
    });

    it('should generate web scraping code with custom URL', async () => {
      const args = { 
        operation: 'web_scraping',
        input_data: 'https://news.ycombinator.com'
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('https://news.ycombinator.com');
      expect(response.generated_code).toContain('soup.find_all');
    });
  });

  describe('Data Analysis Operation', () => {
    it('should generate data analysis code with sample data', async () => {
      const args = { operation: 'data_analysis' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('pandas');
      expect(response.generated_code).toContain('numpy');
      expect(response.generated_code).toContain('describe()');
      expect(response.generated_code).toContain('correlation');
      expect(response.required_libraries).toContain('pandas');
      expect(response.required_libraries).toContain('numpy');
    });

    it('should generate data analysis code with provided data', async () => {
      const csvData = 'name,age,salary\nJohn,25,50000\nJane,30,60000';
      const args = { 
        operation: 'data_analysis',
        input_data: csvData
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain(csvData);
      expect(response.generated_code).toContain('pd.read_csv');
      expect(response.generated_code).toContain('StringIO');
    });
  });

  describe('Visualization Operation', () => {
    it('should generate visualization code with sample data', async () => {
      const args = { operation: 'visualization' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('matplotlib');
      expect(response.generated_code).toContain('seaborn');
      expect(response.generated_code).toContain('plt.subplots');
      expect(response.generated_code).toContain('plt.show()');
      expect(response.required_libraries).toContain('matplotlib');
      expect(response.required_libraries).toContain('seaborn');
    });

    it('should generate visualization code with provided data', async () => {
      const csvData = 'x,y,category\n1,2,A\n3,4,B';
      const args = { 
        operation: 'visualization',
        input_data: csvData
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain(csvData);
      expect(response.generated_code).toContain('hist(');
      expect(response.generated_code).toContain('scatter(');
    });
  });

  describe('Machine Learning Operation', () => {
    it('should generate ML code with sample data', async () => {
      const args = { operation: 'machine_learning' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain('sklearn');
      expect(response.generated_code).toContain('RandomForest');
      expect(response.generated_code).toContain('train_test_split');
      expect(response.generated_code).toContain('make_classification');
      expect(response.required_libraries).toContain('scikit-learn');
    });

    it('should generate ML code with provided data', async () => {
      const csvData = 'feature1,feature2,target\n1,2,0\n3,4,1';
      const args = { 
        operation: 'machine_learning',
        input_data: csvData
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain(csvData);
      expect(response.generated_code).toContain('accuracy_score');
      expect(response.generated_code).toContain('feature_importances_');
    });
  });

  describe('Custom Operation', () => {
    it('should handle custom operation with provided code', async () => {
      const customCode = 'df = pd.DataFrame({"test": [1, 2, 3]})\nprint(df.head())';
      const args = { 
        operation: 'custom',
        custom_code: customCode
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.generated_code).toContain(customCode);
      expect(response.generated_code).toContain('import pandas');
      expect(response.generated_code).toContain('import numpy');
    });

    it('should require custom_code for custom operation', async () => {
      const args = { operation: 'custom' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Unknown operation: custom');
    });
  });

  describe('Library Requirements', () => {
    it('should return correct libraries for each operation', async () => {
      const operations = [
        { op: 'web_scraping', libs: ['requests', 'beautifulsoup4', 'pandas'] },
        { op: 'data_analysis', libs: ['pandas', 'numpy'] },
        { op: 'visualization', libs: ['matplotlib', 'seaborn', 'pandas', 'numpy'] },
        { op: 'machine_learning', libs: ['scikit-learn', 'pandas', 'numpy'] }
      ];

      for (const { op, libs } of operations) {
        const args = { operation: op };
        const result = await tool.handle(args);
        
        expect(result.isError).toBe(false);
        const response = JSON.parse(result.content[0].text);
        
        for (const lib of libs) {
          expect(response.required_libraries).toContain(lib);
        }
      }
    });

    it('should return correct libraries for custom operation with code', async () => {
      const args = { 
        operation: 'custom', 
        custom_code: 'df = pd.DataFrame({"test": [1, 2, 3]})' 
      };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      expect(response.required_libraries).toContain('pandas');
      expect(response.required_libraries).toContain('numpy');
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
      expect(response).toHaveProperty('execution_ready');
      expect(response).toHaveProperty('instructions');
      expect(response).toHaveProperty('required_libraries');
      
      expect(response.execution_ready).toBe(true);
      expect(Array.isArray(response.instructions)).toBe(true);
      expect(Array.isArray(response.required_libraries)).toBe(true);
    });

    it('should include execution instructions', async () => {
      const args = { operation: 'visualization' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(false);
      const response = JSON.parse(result.content[0].text);
      
      expect(response.instructions).toContain('1. Use mcp__ide__executeCode tool with the generated_code');
      expect(response.instructions).toContain('2. Libraries will be auto-installed if missing');
      expect(response.instructions).toContain('3. Results will be displayed in the Jupyter kernel');
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      // Mock validateArgs to throw an error
      vi.spyOn(tool as any, 'validateArgs').mockImplementation(() => {
        throw new Error('Invalid arguments');
      });

      const args = { operation: 'data_analysis' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Invalid arguments');
    });

    it('should handle non-Error exceptions', async () => {
      // Mock validateArgs to throw a string
      vi.spyOn(tool as any, 'validateArgs').mockImplementation(() => {
        throw 'String error occurred';
      });

      const args = { operation: 'machine_learning' };
      const result = await tool.handle(args);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('String error occurred');
    });
  });
});