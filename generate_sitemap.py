import json
import os
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def generate_sitemap():
    # Base URL
    base_url = "https://www.ahmedmahfoozalikhan.me"
    
    # Path to projects data
    data_path = os.path.join("src", "data", "portfolio_content.json")
    
    with open(data_path, "r") as f:
        data = json.load(f)
        projects = data.get("projects", [])

    # Static URLs
    urls = [
        {"url": f"{base_url}/", "changefreq": "weekly", "priority": "1.0"}
    ]

    # Project detail URLs
    for p in projects:
        if "slug" in p:
            category_slug = slugify(p.get("category", "general"))
            project_slug = p["slug"]
            urls.append({
                "url": f"{base_url}/projects/{category_slug}/{project_slug}",
                "changefreq": "monthly",
                "priority": "0.8"
            })

    # Generate XML
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for u in urls:
        xml_content += "  <url>\n"
        xml_content += f'    <loc>{u["url"]}</loc>\n'
        xml_content += f'    <changefreq>{u["changefreq"]}</changefreq>\n'
        xml_content += f'    <priority>{u["priority"]}</priority>\n'
        xml_content += "  </url>\n"
        
    xml_content += "</urlset>\n"

    # Write to public/sitemap.xml
    output_path = os.path.join("public", "sitemap.xml")
    with open(output_path, "w") as f:
        f.write(xml_content)
    
    print(f"Successfully generated {output_path} with {len(urls)} URLs.")

if __name__ == "__main__":
    generate_sitemap()
