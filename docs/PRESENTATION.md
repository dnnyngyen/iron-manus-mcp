# Iron Manus MCP - Presentation System

## Overview

Iron Manus MCP includes presentation generation capabilities integrated into the FSM workflow through role-based orchestration. The implementation follows the metaprompting-first philosophy where AI agents make creative decisions and tools handle deterministic rendering.

## Metaprompting-First Philosophy

The presentation system embodies Iron Manus MCP's core principle: **prompt intelligence rather than replace it**.

### Design Approach
- **Conceptual Template Guides**: Metaprompting frameworks that guide thinking rather than constraining it
- **Role-Based Orchestration**: Specialized agents handle creative interpretation
- **Tool Boundaries**: Deterministic rendering separate from creative decisions
- **Session Coordination**: Workspace isolation for collaborative presentation creation

## Architecture

### Presentation Roles
- **slide_architect** - Overall presentation structure and narrative flow design
- **content_creator** - Text content generation and storytelling
- **visual_designer** - Graphics, charts, and visual elements
- **brand_enforcer** - Brand consistency and style guide compliance
- **audience_analyst** - Audience-specific optimization and targeting

### FSM Integration
- **INIT/QUERY**: Presentation requirements gathering
- **ENHANCE**: Content enrichment and research
- **KNOWLEDGE**: API integration for data sources
- **PLAN**: Slide structure planning via slide_architect role
- **EXECUTE**: Content generation and assembly through role coordination
- **VERIFY**: Quality validation and brand compliance
- **DONE**: Final presentation delivery

### Core Components

1. **Conceptual Guides** (`src/config/presentation-templates.ts`):
   - Metaprompting frameworks for each template type
   - Strategic questions that guide agent thinking
   - Template selection criteria and cognitive triggers

2. **Template System** (`src/templates/`):
   - 12 template types with intelligent content analysis
   - HTML structures with Tailwind CSS styling
   - Template selection engine based on content patterns

3. **Tools**:
   - SlideGeneratorTool - Deterministic slide rendering from structured data
   - Integration with existing Iron Manus MCP tool registry

## Template Types

| Template ID | Use Case | Content Triggers |
|-------------|----------|------------------|
| `cover_slide` | Presentation opening | Title, subtitle, date |
| `data_table` | Tabular data | Numbers, headers, structured data |
| `team_showcase` | Personnel info | Names, titles, team keywords |
| `quote_highlight` | Testimonials | Quote marks, attribution |
| `timeline_flow` | Sequential processes | Dates, chronological markers |
| `visual_showcase` | Image-heavy content | Image keywords, visual descriptors |
| `comparison_layout` | Feature comparisons | "vs", "versus", comparative terms |
| `bulleted_list` | Enumerated content | List markers, bullet points |
| `table_of_contents` | Navigation | Section headers, navigation terms |
| `closing_slide` | Conclusion | Thank you, contact info |
| `standard_content` | General text | Default fallback |
| `system_diagram` | Technical diagrams | Architecture, flow descriptions |

## Usage Pattern

1. **QUERY Phase**: User specifies presentation requirements
2. **PLAN Phase**: slide_architect analyzes requirements and creates structured plan using conceptual guides
3. **EXECUTE Phase**: Coordinated role execution (content_creator, visual_designer, etc.) with SlideGeneratorTool
4. **VERIFY Phase**: Quality validation through brand_enforcer and critic roles

## Technical Integration

- **API Registry**: 65+ APIs available with role-based intelligent selection
- **Session Management**: Isolated workspace for each presentation project
- **Type System**: Full TypeScript integration with comprehensive interfaces
- **Security**: Multi-layered validation through Claude Code Hooks
- **Tool Registry**: Integration with MCP tool system for seamless orchestration

## Quality Assurance

- **Template Validation**: Structural integrity, placeholder completeness
- **Content Quality**: Template fit, visual balance, brand compliance
- **Integration Testing**: FSM phase transitions, role coordination
- **Security**: HTML sanitization, content validation, session isolation

This approach delivers professional presentation capabilities while maintaining Iron Manus MCP's metaprompting-first philosophy and elegant architectural design.