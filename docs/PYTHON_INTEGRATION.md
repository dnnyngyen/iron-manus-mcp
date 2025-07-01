# Python Data Science Integration with Iron Manus MCP

## Overview

The Iron Manus MCP server now includes integrated Python data science capabilities that leverage the MCP IDE's `executeCode` tool to run Python libraries like BeautifulSoup4, pandas, numpy, scipy, scikit-learn, and matplotlib.

## Available Tools

### 1. PythonDataAnalysis
Basic Python data science operations with code generation.

```typescript
// Usage example
{
  "operation": "parse_html",
  "data": "<html><body><h1>Test</h1></body></html>",
  "output_format": "json"
}
```

### 2. PythonExecutor
Direct Python code execution with automatic library installation.

```typescript
// Usage example
{
  "code": "import pandas as pd; print(pd.__version__)",
  "setup_libraries": ["pandas"]
}
```

### 3. EnhancedPythonDataScience
Complete data science workflows with automatic execution preparation.

```typescript
// Usage example
{
  "operation": "data_analysis",
  "input_data": "name,age,city\nJohn,25,NYC\nJane,30,LA",
  "parameters": {}
}
```

## Integration Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   Iron Manus MCP    │    │   Python Data        │    │   MCP IDE           │
│   FSM Controller    │───▶│   Science Tools      │───▶│   executeCode       │
│                     │    │                      │    │                     │
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
           │                           │                └─────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────┐    ┌──────────────────────┐
│   FSM Orchestration │    │   Code Generation    │
│   - INIT            │    │   - Auto-install     │
│   - QUERY           │    │   - Error handling   │
│   - ENHANCE         │    │   - Output formatting│
│   - KNOWLEDGE       │    │   - Visualization    │
│   - PLAN            │    └──────────────────────┘
│   - EXECUTE         │
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
// Through JARVIS FSM
{
  "phase_completed": "ENHANCE",
  "payload": {
    "enhanced_objective": "Scrape product data from e-commerce site",
    "selected_role": "researcher",
    "tools_to_use": ["EnhancedPythonDataScience"]
  }
}

// Direct tool usage
{
  "operation": "web_scraping", 
  "input_data": "https://example.com/products",
  "parameters": {
    "extract_elements": ["title", "price", "description"]
  }
}
```

### 2. Data Analysis Workflow

```javascript
// CSV data analysis
{
  "operation": "data_analysis",
  "input_data": "sales,region,product\n100,North,A\n200,South,B\n150,East,A",
  "parameters": {
    "analysis_type": "comprehensive"
  }
}
```

### 3. Machine Learning Pipeline

```javascript
{
  "operation": "machine_learning",
  "input_data": "feature1,feature2,target\n1.2,2.3,0\n2.1,1.8,1\n3.4,4.1,1",
  "parameters": {
    "model_type": "classification",
    "test_size": 0.2
  }
}
```

## Generated Python Code Examples

### Automatic Library Installation
```python
# Auto-install required libraries
try:
    import pandas
except ImportError:
    import subprocess
    import sys
    print("📦 Installing pandas...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pandas"])
    import pandas
    print("✅ pandas installed successfully")

# Your analysis code here...
```

### Web Scraping Code
```python
import requests
from bs4 import BeautifulSoup
import pandas as pd

url = "https://example.com"
headers = {'User-Agent': 'Mozilla/5.0 (compatible; Data Science Tool)'}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')

data = {
    'title': soup.find('title').text if soup.find('title') else 'No title',
    'headings': [h.get_text().strip() for h in soup.find_all(['h1', 'h2', 'h3'])],
    'links': [{'text': a.get_text().strip(), 'href': a.get('href')} 
             for a in soup.find_all('a', href=True)[:20]]
}

print("✅ Web scraping completed successfully")
```

### Data Visualization Code
```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Create comprehensive visualization dashboard
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('Data Visualization Dashboard', fontsize=16, fontweight='bold')

# Multiple plot types automatically generated
df[numeric_cols[0]].hist(bins=20, ax=axes[0,0], alpha=0.7, color='skyblue')
# ... additional plots

plt.tight_layout()
plt.show()
```

## Integration with FSM Phases

### QUERY Phase
- Identifies data science requirements
- Determines appropriate Python libraries needed

### ENHANCE Phase  
- Selects optimal role (researcher, analyzer, data_scientist)
- Applies cognitive enhancement for data science thinking

### KNOWLEDGE Phase
- Accesses Python documentation APIs
- Gathers relevant data science knowledge

### PLAN Phase
- Creates detailed Python execution plan
- Generates code templates and workflows

### EXECUTE Phase
- Runs Python code through MCP IDE executeCode
- Handles library installation and imports
- Processes data and generates outputs

### VERIFY Phase
- Validates Python execution results
- Checks data quality and analysis correctness
- Ensures visualizations are properly generated

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

## Future Enhancements

1. **Deep Learning Integration**: TensorFlow/PyTorch support
2. **Advanced Visualization**: Plotly interactive charts
3. **Time Series Analysis**: Specialized time series tools
4. **Natural Language Processing**: NLTK/spaCy integration
5. **Image Processing**: OpenCV and PIL support

## Performance Characteristics

- **Library Installation**: ~5-15 seconds per new library
- **Data Analysis**: ~1-5 seconds for typical datasets (<10MB)
- **Visualization**: ~2-10 seconds depending on complexity  
- **ML Training**: ~10-60 seconds for typical classification tasks
- **Web Scraping**: ~2-15 seconds per page

The integration provides a seamless bridge between Iron Manus's intelligent orchestration and Python's powerful data science ecosystem, enabling sophisticated data analysis workflows within the MCP framework.