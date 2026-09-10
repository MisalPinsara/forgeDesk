import re
import os

def html_to_jsx(html):
    # Remove script tags
    html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    
    # Extract content inside <main>...</main>
    match = re.search(r'<main[^>]*>(.*?)</main>', html, flags=re.DOTALL)
    if match:
        html = match.group(1).strip()
    
    # Convert class to className
    html = re.sub(r'\bclass="', 'className="', html)
    
    # Convert for to htmlFor
    html = re.sub(r'\bfor="', 'htmlFor="', html)
    
    # Self-close input, img, br, hr
    def self_close_fix(m):
        tag = m.group(1)
        attrs = m.group(2)
        if attrs.endswith('/'):
            return f'<{tag}{attrs}>'
        return f'<{tag}{attrs} />'
    html = re.sub(r'<(input|img|br|hr)([^>]*?)>', self_close_fix, html)

    # Convert comments
    html = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', html, flags=re.DOTALL)

    def style_repl(m):
        style_str = m.group(1)
        rules = style_str.split(';')
        out = []
        for r in rules:
            r = r.strip()
            if not r: continue
            k, v = r.split(':', 1)
            k = k.strip()
            parts = k.split('-')
            k_camel = parts[0] + ''.join(p.capitalize() for p in parts[1:])
            v = v.strip().replace("'", '"')
            out.append(f"{k_camel}: '{v}'")
        return "style={{" + ", ".join(out) + "}}"

    html = re.sub(r'style="([^"]*)"', style_repl, html)

    # Fix inline event handlers
    html = re.sub(r'onclick="[^"]*"', '', html)
    html = re.sub(r'onkeyup="[^"]*"', '', html)
    html = re.sub(r'onchange="[^"]*"', '', html)
    html = re.sub(r'onsubmit="[^"]*"', 'onSubmit={(e) => e.preventDefault()}', html)

    # Replace specific characters that might break JSX
    # But usually inside text it's fine unless it's `<` or `{`.
    # Let's hope there are no bare `{` or `<` characters in the text that break jsx.

    return f'<>\n{html}\n</>'

def process_file(in_path, out_path, component_name):
    with open(in_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    jsx = html_to_jsx(html)
    
    out_code = f"""import React from 'react';\n\nexport default function {component_name}() {{\n  return (\n    {jsx}\n  );\n}}\n"""
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(out_code)
    print(f"Created {out_path}")

base_dir = "c:/Users/misal/OneDrive/Documents/git/forgeDesk"
process_file(f"{base_dir}/forge_desk_design/job_details_wjdms/code.html",
             f"{base_dir}/client/src/pages/JobDetails.tsx",
             "JobDetails")
process_file(f"{base_dir}/forge_desk_design/create_job_wjdms/code.html",
             f"{base_dir}/client/src/pages/CreateJob.tsx",
             "CreateJob")
process_file(f"{base_dir}/forge_desk_design/document_templates_wjdms/code.html",
             f"{base_dir}/client/src/pages/DocumentTemplates.tsx",
             "DocumentTemplates")
