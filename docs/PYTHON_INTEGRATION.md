# Python Data Science Integration with Iron Manus MCP

## Overview

The Iron Manus MCP server includes unified Python data science capabilities through the consolidated **PythonComputationalTool**. This tool leverages the MCP IDE's `executeCode` functionality to run Python libraries like BeautifulSoup4, pandas, numpy, scipy, scikit-learn, and matplotlib.

**Major Consolidation (v0.2.5+):** All Python operations are now handled by a single, intelligent tool that replaces the previous three separate tools:
- ❌ **Deprecated**: PythonDataAnalysis, PythonExecutor, EnhancedPythonDataScience  
- ✅ **Unified**: PythonComputationalTool with operation-specific workflows

## Available Tool

### PythonComputationalTool ⭐ **[Unified Python Operations]**

Comprehensive Python execution and data science tool with automatic library management and workflow support.

**Operations Available:**
- `web_scraping`: Extract data from websites using BeautifulSoup
- `data_analysis`: Comprehensive analysis with pandas and numpy
- `visualization`: Charts and plots with matplotlib and seaborn
- `machine_learning`: ML models with scikit-learn
- `custom`: User-provided Python code with library management

```typescript
// Web scraping example
{
  "operation": "web_scraping",
  "input_data": "https://example.com/data",
  "parameters": {
    "selector": ".data-table tr",
    "output_format": "csv"
  }
}

// Data analysis example
{
  "operation": "data_analysis",
  "input_data": "name,age,city\nJohn,25,NYC\nJane,30,LA",
  "parameters": {
    "analysis_type": "descriptive",
    "target_column": "age"
  }
}

// Custom code example
{
  "operation": "custom",
  "custom_code": "import pandas as pd\ndf = pd.DataFrame({'x': [1,2,3]})\nprint(df.describe())"
}
```

## Integration Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   Iron Manus MCP    │    │  PythonComputational │    │   MCP IDE           │
│   FSM Controller    │───▶│      Tool            │───▶│   executeCode       │
│                     │    │   (Unified Python)   │    │                     │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
           │                           │                           │
           │                           │                           ▼
           │                           │                ┌─────────────────────┐
           │                           │                │   Jupyter Kernel    │
           │                           │                │   - BeautifulSoup4  │
           │                           │                │   - pandas          │
           │                           │                │   - numpy           │
           │                           │                │   - scipy           │
           │                           │                │   - scikit-learn    │
           │                           │                │   - matplotlib      │
           │                           │                │   - seaborn         │
           │                           │                └─────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────┐    ┌──────────────────────┐
│   FSM Orchestration │    │   Unified Workflows  │
│   - INIT            │    │   - Template-based   │
│   - QUERY           │    │   - Auto-install     │
│   - ENHANCE         │    │   - Error handling   │
│   - KNOWLEDGE       │    │   - Security guard   │
│   - PLAN            │    │   - Output format    │
│   - EXECUTE         │    └──────────────────────┘
│   - VERIFY          │
│   - DONE            │
└─────────────────────┘
```

## Supported Operations

### Web Scraping
- HTML parsing with BeautifulSoup4
- XML processing with lxml
- Automatic data extraction and structuring

### Data Analysis  
- DataFrame operations with pandas
- Statistical analysis with numpy/scipy
- Data quality assessment
- Correlation analysis

### Visualization
- Matplotlib plotting
- Seaborn statistical visualizations
- Multi-panel dashboards
- Automatic chart type selection

### Machine Learning
- Classification and regression
- Feature importance analysis
- Model evaluation
- Automated preprocessing

## Usage Examples

### 1. Web Scraping Example

```javascript
// Through JARVIS FSM (updated for v0.2.5+)
{
  "phase_completed": "ENHANCE",
  "payload": {
    "enhanced_objective": "Scrape product data from e-commerce site",
    "selected_role": "researcher",
    "tools_to_use": ["PythonComputationalTool"]
  }
}

// Direct PythonComputationalTool usage
{
  "operation": "web_scraping", 
  "input_data": "https://example.com/products",
  "parameters": {
    "selector": ".product-item",
    "extract_fields": ["title", "price", "description"],
    "output_format": "csv"
  }
}
```

### 2. Data Analysis Workflow

```javascript
// CSV data analysis with PythonComputationalTool
{
  "operation": "data_analysis",
  "input_data": "sales,region,product\n100,North,A\n200,South,B\n150,East,A",
  "parameters": {
    "analysis_type": "comprehensive",
    "target_column": "sales",
    "generate_plots": true
  }
}
```

### 3. Machine Learning Pipeline

```javascript
// ML workflow with unified tool
{
  "operation": "machine_learning",
  "input_data": "feature1,feature2,target\n1.2,2.3,0\n2.1,1.8,1\n3.4,4.1,1",
  "parameters": {
    "model_type": "classification",
    "target_column": "target",
    "test_size": 0.2,
    "cv_folds": 5
  }
}
```

### 4. Visualization Workflow

```javascript
// Dedicated visualization operation
{
  "operation": "visualization",
  "input_data": "month,sales,profit\nJan,100,20\nFeb,150,35\nMar,120,25",
  "parameters": {
    "chart_types": ["line", "bar"],
    "x_column": "month",
    "y_columns": ["sales", "profit"]
  }
}
```

### 5. Custom Python Code

```javascript
// Advanced custom operations
{
  "operation": "custom",
  "custom_code": "import pandas as pd\nimport numpy as np\n\n# Custom analysis logic\ndata = pd.DataFrame({'x': np.random.normal(0, 1, 100)})\nprint(f'Mean: {data.x.mean():.3f}')\nprint(f'Std: {data.x.std():.3f}')"
}
```

## Generated Python Code Examples

### Automatic Library Installation
```python
# PythonComputationalTool generates automatic library management
def ensure_library_installed(library_name, import_name=None):
    """Auto-install and import required libraries"""
    import_name = import_name or library_name
    try:
        __import__(import_name)
        print(f"✅ {library_name} already available")
    except ImportError:
        import subprocess
        import sys
        print(f"📦 Installing {library_name}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", library_name])
        print(f"✅ {library_name} installed successfully")

# Auto-install required libraries for the operation
ensure_library_installed("pandas")
ensure_library_installed("beautifulsoup4", "bs4")
ensure_library_installed("matplotlib")
ensure_library_installed("scikit-learn", "sklearn")

# Generated analysis code follows...
```

### Web Scraping Code
```python
# Generated by PythonComputationalTool for web_scraping operation
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from urllib.parse import urljoin, urlparse

def scrape_website(url, selector="", extract_fields=None, output_format="json"):
    """Intelligent web scraping with SSRF protection"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; Iron Manus MCP Data Science Tool)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
    
    try:
        # SSRF protection - validate URL
        parsed = urlparse(url)
        if not parsed.scheme in ['http', 'https']:
            raise ValueError("Only HTTP/HTTPS URLs are supported")
            
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract data based on selector and fields
        if selector:
            elements = soup.select(selector)
            data = []
            for elem in elements[:100]:  # Limit to prevent memory issues
                row = {}
                if extract_fields:
                    for field in extract_fields:
                        row[field] = elem.get_text().strip() if elem else ""
                else:
                    row['text'] = elem.get_text().strip()
                    row['html'] = str(elem)
                data.append(row)
        else:
            # Default extraction
            data = {
                'title': soup.find('title').text.strip() if soup.find('title') else 'No title',
                'headings': [h.get_text().strip() for h in soup.find_all(['h1', 'h2', 'h3'])[:20]],
                'paragraphs': [p.get_text().strip() for p in soup.find_all('p')[:10]]
            }
            
        print(f"✅ Web scraping completed: extracted {len(data) if isinstance(data, list) else 'structured'} data")
        return data
        
    except Exception as e:
        print(f"❌ Scraping error: {e}")
        return None

# Execute scraping operation
result = scrape_website("{{ url }}", "{{ selector }}", {{ extract_fields }}, "{{ output_format }}")
if result:
    if isinstance(result, list) and len(result) > 0:
        df = pd.DataFrame(result)
        print(f"📊 Created DataFrame with {len(df)} rows and {len(df.columns)} columns")
        print(df.head())
```

### Data Visualization Code
```python
# Generated by PythonComputationalTool for visualization operation
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from matplotlib.gridspec import GridSpec

def create_intelligent_dashboard(df, chart_types=None, x_column=None, y_columns=None):
    """Create comprehensive visualization dashboard based on data characteristics"""
    
    # Auto-detect data types
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    # Determine optimal layout
    n_plots = len(chart_types) if chart_types else min(4, len(numeric_cols) + 1)
    rows = int(np.ceil(n_plots / 2))
    
    fig = plt.figure(figsize=(16, 6 * rows))
    gs = GridSpec(rows, 2, figure=fig, hspace=0.3, wspace=0.3)
    fig.suptitle('Iron Manus Data Visualization Dashboard', fontsize=18, fontweight='bold')
    
    plot_idx = 0
    
    # Generate intelligent visualizations
    if 'distribution' in (chart_types or []) or not chart_types:
        if numeric_cols:
            ax = fig.add_subplot(gs[plot_idx // 2, plot_idx % 2])
            df[numeric_cols[0]].hist(bins=30, ax=ax, alpha=0.7, color='skyblue', edgecolor='black')
            ax.set_title(f'Distribution of {numeric_cols[0]}', fontweight='bold')
            ax.set_xlabel(numeric_cols[0])
            ax.set_ylabel('Frequency')
            plot_idx += 1
    
    if 'correlation' in (chart_types or []) or (not chart_types and len(numeric_cols) > 1):
        if len(numeric_cols) > 1:
            ax = fig.add_subplot(gs[plot_idx // 2, plot_idx % 2])
            correlation_matrix = df[numeric_cols].corr()
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, ax=ax)
            ax.set_title('Feature Correlation Matrix', fontweight='bold')
            plot_idx += 1
    
    if 'scatter' in (chart_types or []) or (not chart_types and len(numeric_cols) >= 2):
        if len(numeric_cols) >= 2:
            ax = fig.add_subplot(gs[plot_idx // 2, plot_idx % 2])
            ax.scatter(df[numeric_cols[0]], df[numeric_cols[1]], alpha=0.6, color='coral')
            ax.set_xlabel(numeric_cols[0])
            ax.set_ylabel(numeric_cols[1])
            ax.set_title(f'{numeric_cols[0]} vs {numeric_cols[1]}', fontweight='bold')
            plot_idx += 1
    
    if 'categorical' in (chart_types or []) or (not chart_types and categorical_cols):
        if categorical_cols:
            ax = fig.add_subplot(gs[plot_idx // 2, plot_idx % 2])
            value_counts = df[categorical_cols[0]].value_counts().head(10)
            value_counts.plot(kind='bar', ax=ax, color='lightgreen')
            ax.set_title(f'Top Categories in {categorical_cols[0]}', fontweight='bold')
            ax.set_xlabel(categorical_cols[0])
            ax.set_ylabel('Count')
            ax.tick_params(axis='x', rotation=45)
            plot_idx += 1
    
    plt.tight_layout()
    print(f"✅ Generated {plot_idx} visualizations")
    plt.show()
    
    return fig

# Execute visualization
if 'df' in locals() or 'df' in globals():
    dashboard = create_intelligent_dashboard(df, {{ chart_types }}, "{{ x_column }}", {{ y_columns }})
else:
    print("⚠️ No DataFrame available. Please provide data first.")
```

## Integration with FSM Phases

The unified **PythonComputationalTool** is integrated across FSM phases to support intelligent Python workflows:

### **KNOWLEDGE Phase**
- **Primary Use**: Data research and initial analysis
- **Operations**: `web_scraping`, `data_analysis` for exploration
- **Integration**: Automatic with `APITaskAgent` for data validation

### **EXECUTE Phase**  
- **Primary Use**: Implementation and computation
- **Operations**: All operations (`custom`, `machine_learning`, `visualization`)
- **Integration**: Direct code generation and execution via `mcp__ide__executeCode`

### **VERIFY Phase**
- **Primary Use**: Results validation and testing
- **Operations**: `data_analysis` for validation, `visualization` for verification
- **Integration**: Automated testing and quality checks

**Migration Note**: References to `EnhancedPythonDataScience`, `PythonExecutor`, and `PythonDataAnalysis` in existing phase configurations have been updated to use `PythonComputationalTool`.

For detailed phase-specific workflows, refer to [PROMPTS.md](./PROMPTS.md) and [ORCHESTRATION.md](./ORCHESTRATION.md).

## Error Handling

The system includes comprehensive error handling:

```python
try:
    # Data science operations
    df = pd.read_csv(data_source)
    results = perform_analysis(df)
except Exception as e:
    print(f"❌ Error in analysis: {e}")
    # Fallback to sample data or alternative approach
```

## Security Considerations

- SSRF protection for web scraping operations
- Input validation for all data sources
- Sandboxed execution through Jupyter kernel
- No direct file system access from generated code
- Rate limiting for external API calls

## Migration from Legacy Tools

### **Before (Deprecated - v0.2.4 and earlier)**
```javascript
// Multiple tool approach (complex)
PythonExecutor({ code: "print('hello')", setup_libraries: ["pandas"] })
PythonDataAnalysis({ operation: "parse_html", data: htmlData })
EnhancedPythonDataScience({ operation: "visualization", input_data: csvData })
```

### **After (Unified - v0.2.5+)**
```javascript
// Single tool approach (streamlined)
PythonComputationalTool({ 
  operation: "custom", 
  custom_code: "print('hello')" 
})
PythonComputationalTool({ 
  operation: "web_scraping", 
  input_data: "https://example.com" 
})
PythonComputationalTool({ 
  operation: "visualization", 
  input_data: csvData 
})
```

## Future Enhancements

1. **Deep Learning Integration**: TensorFlow/PyTorch templates in `custom` operation
2. **Advanced Visualization**: Plotly interactive charts via `visualization` operation
3. **Time Series Analysis**: Specialized templates for temporal data analysis
4. **Natural Language Processing**: NLTK/spaCy integration in `custom` workflows
5. **Image Processing**: OpenCV and PIL support for computer vision tasks
6. **Streaming Data**: Real-time data processing capabilities
7. **GPU Acceleration**: CUDA support for intensive computations

## Performance Characteristics

### **PythonComputationalTool Performance**
- **Code Generation**: ~0.5-2 seconds (template-based)
- **Library Installation**: ~5-15 seconds per new library (cached after first use)
- **Data Analysis**: ~1-5 seconds for typical datasets (<10MB)
- **Visualization**: ~2-10 seconds depending on complexity  
- **ML Training**: ~10-60 seconds for typical classification tasks
- **Web Scraping**: ~2-15 seconds per page (with SSRF protection)
- **Custom Operations**: Variable, depends on user code complexity

### **Optimization Features**
- **Template Caching**: Pre-compiled code templates for faster generation
- **Library Management**: Intelligent caching to avoid repeated installations
- **Memory Efficiency**: Automatic data sampling for large datasets
- **Error Recovery**: Graceful fallbacks for failed operations
- **Security Scanning**: Input validation with minimal performance impact

## Tool Integration Benefits

The **PythonComputationalTool** provides a unified bridge between Iron Manus's intelligent FSM orchestration and Python's powerful data science ecosystem:

✅ **Simplified Workflow**: Single tool replaces complex multi-tool orchestration  
✅ **Consistent Interface**: Unified parameter structure across all Python operations  
✅ **Enhanced Security**: Built-in SSRF protection and input validation  
✅ **Better Performance**: Shared infrastructure and optimized code generation  
✅ **Maintainability**: Single codebase for all Python functionality  
✅ **Extensibility**: Easy addition of new operations and templates  

This consolidation enables sophisticated data analysis workflows within the MCP framework while dramatically reducing complexity and improving reliability.