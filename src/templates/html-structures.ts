/**
 * HTML Template Structures for Iron Manus MCP Slide Generation
 *
 * Based on Genspark design patterns:
 * - 1280px × 720px dimensions
 * - Blue color scheme (#2563eb primary)
 * - Tailwind CSS framework
 * - Roboto font family
 * - Consistent accent bars and footers
 */

export const HTML_TEMPLATES = {
  cover_slide: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .background-pattern { position: absolute; width: 100%; height: 100%; background-size: cover; opacity: 0.1; }
        .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.85); }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 100px 120px; position: relative; z-index: 10; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="background-pattern"></div>
        <div class="overlay"></div>
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <div class="mb-4">
                <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">{{subtitle}}</span>
            </div>
            <h1 class="text-6xl font-bold mb-6 text-blue-900">{{title}}</h1>
            <p class="text-2xl text-gray-700 max-w-3xl">{{description}}</p>
            <div class="mt-16 flex items-center">
                <div class="w-20 h-1 bg-blue-600 mr-4"></div>
                <p class="text-blue-600 font-medium">{{date}}</p>
            </div>
        </div>
    </div>
</body>
</html>`,

  table_of_contents: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table of Contents</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.85); }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 80px 120px; position: relative; z-index: 10; }
        .toc-item { padding: 14px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; }
        .toc-number { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background-color: #2563eb; color: white; border-radius: 50%; margin-right: 20px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="overlay"></div>
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <h1 class="text-4xl font-bold mb-10 text-blue-900">{{title}}</h1>
            <div class="toc-container">{{sections}}</div>
        </div>
    </div>
</body>
</html>`,

  standard_content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.85); }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 80px 120px; position: relative; z-index: 10; display: flex; }
        .text-content { width: 60%; }
        .visual-content { width: 40%; display: flex; align-items: center; justify-content: center; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="overlay"></div>
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <div class="text-content">
                <h1 class="text-4xl font-bold mb-6 text-blue-900">{{title}}</h1>
                <div class="text-lg text-gray-700">{{content}}</div>
                <div class="mt-6">{{bullet_points}}</div>
            </div>
            <div class="visual-content">{{image}}</div>
        </div>
    </div>
</body>
</html>`,

  data_table: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 80px 120px; position: relative; z-index: 10; }
        .data-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .data-table th { background-color: #2563eb; color: white; padding: 12px; text-align: left; font-weight: 600; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .data-table tr:hover { background-color: #f9fafb; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <h1 class="text-4xl font-bold mb-8 text-blue-900">{{title}}</h1>
            <div class="mb-4">
                <p class="text-lg text-gray-600">{{description}}</p>
            </div>
            {{table_data}}
            <div class="mt-6">{{notes}}</div>
        </div>
    </div>
</body>
</html>`,

  team_showcase: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 80px 120px; position: relative; z-index: 10; }
        .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .team-member-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .member-photo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 16px; object-fit: cover; }
        .member-name { font-size: 1.25rem; font-weight: 600; color: #2563eb; margin-bottom: 8px; }
        .member-title { color: #6b7280; margin-bottom: 12px; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <h1 class="text-4xl font-bold mb-8 text-blue-900">{{title}}</h1>
            <div class="team-grid">{{team_members}}</div>
        </div>
    </div>
</body>
</html>`,

  quote_highlight: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; display: flex; align-items: center; justify-content: center; }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .quote-container { text-align: center; max-width: 800px; padding: 0 60px; }
        .quote-mark { font-size: 4rem; color: #2563eb; opacity: 0.3; }
        .quote-text { font-size: 2.5rem; font-style: italic; line-height: 1.4; color: #374151; margin: 24px 0; }
        .attribution { font-size: 1.25rem; color: #6b7280; border-top: 2px solid #2563eb; padding-top: 16px; margin-top: 32px; display: inline-block; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="accent-bar"></div>
        <div class="quote-container">
            <i class="fas fa-quote-left quote-mark"></i>
            <p class="quote-text">{{quote_text}}</p>
            <div class="attribution">{{attribution}}</div>
        </div>
    </div>
</body>
</html>`,

  timeline_flow: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 80px 120px; position: relative; z-index: 10; }
        .timeline-container { position: relative; margin-top: 40px; }
        .timeline-line { position: absolute; width: 100%; height: 3px; background-color: #e5e7eb; top: 30px; }
        .timeline-progress { position: absolute; width: 70%; height: 3px; background-color: #2563eb; top: 30px; }
        .timeline-item { position: relative; display: inline-block; width: 200px; margin-right: 40px; vertical-align: top; }
        .timeline-marker { width: 24px; height: 24px; background-color: #2563eb; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px #2563eb; position: relative; z-index: 2; margin: 0 auto; }
        .timeline-content { background: white; border-radius: 8px; padding: 16px; margin-top: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <h1 class="text-4xl font-bold mb-8 text-blue-900">{{title}}</h1>
            <div class="timeline-container">
                <div class="timeline-line"></div>
                <div class="timeline-progress"></div>
                {{timeline_items}}
            </div>
        </div>
    </div>
</body>
</html>`,

  visual_showcase: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #000; color: #fff; }
        .main-image { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(45deg, rgba(37,99,235,0.3), rgba(0,0,0,0.6)); }
        .content-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 60px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; z-index: 10; }
    </style>
</head>
<body>
    <div class="slide-container">
        <img src="{{image_url}}" alt="{{image_alt}}" class="main-image">
        <div class="overlay"></div>
        <div class="accent-bar"></div>
        <div class="content-overlay">
            <h1 class="text-5xl font-bold mb-4">{{title}}</h1>
            <p class="text-xl opacity-90">{{caption}}</p>
        </div>
    </div>
</body>
</html>`,

  comparison_layout: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 80px 120px; position: relative; z-index: 10; }
        .comparison-container { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
        .comparison-item { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; }
        .comparison-item:first-child { border-top: 4px solid #2563eb; }
        .comparison-item:last-child { border-top: 4px solid #059669; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <h1 class="text-4xl font-bold mb-8 text-blue-900">{{title}}</h1>
            {{comparison_items}}
        </div>
    </div>
</body>
</html>`,

  bulleted_list: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 80px 120px; position: relative; z-index: 10; }
        .list-container { margin-top: 40px; }
        .list-item { display: flex; align-items: flex-start; margin-bottom: 24px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .list-marker { width: 40px; height: 40px; background-color: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 20px; flex-shrink: 0; }
        .list-content { flex-grow: 1; }
        .list-content h4 { margin: 0 0 8px 0; color: #2563eb; font-size: 1.125rem; font-weight: 600; }
        .list-content p { margin: 0; color: #6b7280; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <h1 class="text-4xl font-bold mb-8 text-blue-900">{{title}}</h1>
            <div class="list-container">{{list_items}}</div>
        </div>
    </div>
</body>
</html>`,

  closing_slide: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; display: flex; align-items: center; justify-content: center; }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .closing-content { text-align: center; max-width: 600px; }
        .closing-title { font-size: 3rem; font-weight: bold; color: #2563eb; margin-bottom: 24px; }
        .closing-message { font-size: 1.5rem; color: #6b7280; margin-bottom: 40px; }
        .contact-info { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="accent-bar"></div>
        <div class="closing-content">
            <h1 class="closing-title">{{title}}</h1>
            <p class="closing-message">{{message}}</p>
            <div class="contact-info">{{contact_details}}</div>
        </div>
    </div>
</body>
</html>`,

  system_diagram: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; overflow: hidden; }
        .slide-container { width: 1280px; min-height: 720px; position: relative; background-color: #f8f9fa; color: #343a40; }
        .accent-bar { position: absolute; left: 0; top: 0; width: 12px; height: 100%; background-color: #2563eb; }
        .content-wrapper { padding: 80px 120px; position: relative; z-index: 10; }
        .diagram-container { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 40px; position: relative; min-height: 400px; }
        .diagram-node { position: absolute; background: #2563eb; color: white; padding: 12px 20px; border-radius: 8px; font-weight: 500; text-align: center; min-width: 120px; }
        .connection-line { position: absolute; height: 2px; background-color: #6b7280; }
        .arrow { width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 10px solid #6b7280; position: absolute; }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="accent-bar"></div>
        <div class="content-wrapper">
            <h1 class="text-4xl font-bold mb-8 text-blue-900">{{title}}</h1>
            <div class="diagram-container">{{diagram_elements}}</div>
        </div>
    </div>
</body>
</html>`,
};
