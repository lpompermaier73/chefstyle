#!/usr/bin/env python3
"""
Script para converter export XML do Blogger para o formato ChefStyle
"""

import xml.etree.ElementTree as ET
import json
import re
from html import unescape

def clean_html(html_text):
    """Remove tags HTML e limpa o texto"""
    # Remove tags HTML
    clean = re.sub('<.*?>', '', html_text)
    # Decodifica entidades HTML
    clean = unescape(clean)
    # Remove espaços extras
    clean = ' '.join(clean.split())
    return clean

def extract_posts_from_blogger_xml(xml_file):
    """Extrai posts do arquivo XML do Blogger"""
    
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    # Namespace do Atom (usado pelo Blogger)
    ns = {'atom': 'http://www.w3.org/2005/Atom'}
    
    posts = []
    post_id = 1
    
    # Encontra todas as entradas
    for entry in root.findall('atom:entry', ns):
        # Verifica se é um post (não comentário ou configuração)
        category = entry.find('atom:category', ns)
        if category is not None and category.get('term') == 'http://schemas.google.com/blogger/2008/kind#post':
            
            # Extrai título
            title_elem = entry.find('atom:title', ns)
            title = title_elem.text if title_elem is not None else "Sem título"
            
            # Extrai conteúdo
            content_elem = entry.find('atom:content', ns)
            content = content_elem.text if content_elem is not None else ""
            
            # Extrai data de publicação
            published_elem = entry.find('atom:published', ns)
            published = published_elem.text if published_elem is not None else ""
            
            # Limpa o conteúdo HTML
            clean_content = clean_html(content) if content else ""
            
            # Cria excerpt (primeiras 150 caracteres)
            excerpt = clean_content[:150] + "..." if len(clean_content) > 150 else clean_content
            
            # Tenta detectar categoria baseada no título
            category = detect_category(title)
            
            # Tenta detectar emoji baseado na categoria
            emoji = get_emoji_for_category(category)
            
            post = {
                'id': post_id,
                'title': title,
                'category': category,
                'emoji': emoji,
                'excerpt': excerpt,
                'time': '30 min',  # Valor padrão - você pode editar depois
                'servings': '4 porções',  # Valor padrão - você pode editar depois
                'content': clean_content,
                'published': published,
                'ingredients': [],  # A ser preenchido manualmente
                'instructions': [],  # A ser preenchido manualmente
                'tips': ''  # A ser preenchido manualmente
            }
            
            posts.append(post)
            post_id += 1
    
    return posts

def detect_category(title):
    """Tenta detectar a categoria baseada no título"""
    title_lower = title.lower()
    
    if any(word in title_lower for word in ['massa', 'macarrão', 'espaguete', 'lasanha', 'penne']):
        return 'Massas'
    elif any(word in title_lower for word in ['salada', 'verde']):
        return 'Saladas'
    elif any(word in title_lower for word in ['bolo', 'torta', 'sobremesa', 'doce', 'brownie', 'pudim']):
        return 'Sobremesas'
    elif any(word in title_lower for word in ['carne', 'bife', 'churrasco']):
        return 'Carnes'
    elif any(word in title_lower for word in ['frango', 'galinha']):
        return 'Aves'
    elif any(word in title_lower for word in ['peixe', 'camarão', 'salmão', 'bacalhau']):
        return 'Frutos do Mar'
    elif any(word in title_lower for word in ['sopa', 'caldo']):
        return 'Sopas'
    elif any(word in title_lower for word in ['hamburguer', 'burger', 'sanduíche', 'wrap']):
        return 'Hambúrgueres'
    elif any(word in title_lower for word in ['vegano', 'vegetariano']):
        return 'Vegetariano'
    else:
        return 'Receitas'

def get_emoji_for_category(category):
    """Retorna emoji apropriado para cada categoria"""
    emojis = {
        'Massas': '🍝',
        'Saladas': '🥗',
        'Sobremesas': '🍰',
        'Carnes': '🥩',
        'Aves': '🍗',
        'Frutos do Mar': '🍤',
        'Sopas': '🍲',
        'Hambúrgueres': '🍔',
        'Vegetariano': '🥙',
        'Receitas': '🍽️'
    }
    return emojis.get(category, '🍽️')

def generate_recipes_js(posts):
    """Gera o conteúdo do arquivo recipes-data.js"""
    
    js_content = "// Base de dados de receitas - Convertido do Blogger\n"
    js_content += "const recipesDatabase = [\n"
    
    for i, post in enumerate(posts):
        js_content += "    {\n"
        js_content += f"        id: {post['id']},\n"
        js_content += f"        title: {json.dumps(post['title'], ensure_ascii=False)},\n"
        js_content += f"        category: {json.dumps(post['category'], ensure_ascii=False)},\n"
        js_content += f"        emoji: {json.dumps(post['emoji'], ensure_ascii=False)},\n"
        js_content += f"        excerpt: {json.dumps(post['excerpt'], ensure_ascii=False)},\n"
        js_content += f"        time: {json.dumps(post['time'], ensure_ascii=False)},\n"
        js_content += f"        servings: {json.dumps(post['servings'], ensure_ascii=False)},\n"
        
        # Ingredients (vazio por padrão)
        js_content += "        ingredients: [\n"
        js_content += "            // PREENCHER: Adicione os ingredientes aqui\n"
        js_content += "        ],\n"
        
        # Instructions (vazio por padrão)
        js_content += "        instructions: [\n"
        js_content += "            // PREENCHER: Adicione as instruções aqui\n"
        js_content += "        ],\n"
        
        js_content += "        tips: '' // PREENCHER: Adicione dicas aqui\n"
        
        if i < len(posts) - 1:
            js_content += "    },\n\n"
        else:
            js_content += "    }\n"
    
    js_content += "];\n\n"
    js_content += "// Exporta para uso em outros arquivos\n"
    js_content += "if (typeof module !== 'undefined' && module.exports) {\n"
    js_content += "    module.exports = recipesDatabase;\n"
    js_content += "}"
    
    return js_content

def main():
    """Função principal"""
    print("=" * 60)
    print("Conversor de Blogger XML para ChefStyle")
    print("=" * 60)
    print()
    
    xml_file = input("Digite o caminho do arquivo XML do Blogger: ").strip()
    
    try:
        print("\n📖 Lendo arquivo XML...")
        posts = extract_posts_from_blogger_xml(xml_file)
        
        print(f"✅ {len(posts)} posts encontrados!")
        print("\n📝 Posts encontrados:")
        for post in posts:
            print(f"  - {post['title']} ({post['category']})")
        
        print("\n💾 Gerando arquivo recipes-data.js...")
        js_content = generate_recipes_js(posts)
        
        output_file = 'recipes-data-converted.js'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"✅ Arquivo gerado: {output_file}")
        
        # Também gera JSON para referência
        json_file = 'posts-reference.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Referência JSON gerada: {json_file}")
        
        print("\n" + "=" * 60)
        print("PRÓXIMOS PASSOS:")
        print("=" * 60)
        print("1. Abra o arquivo 'recipes-data-converted.js'")
        print("2. Preencha os ingredientes e instruções de cada receita")
        print("3. Adicione dicas se desejar")
        print("4. Substitua o arquivo recipes-data.js no GitHub")
        print("5. Suas receitas estarão no blog!")
        print("\n⚠️  IMPORTANTE: O conteúdo HTML foi convertido para texto.")
        print("   Você precisará organizar manualmente ingredientes e")
        print("   instruções para cada receita.")
        print("=" * 60)
        
    except FileNotFoundError:
        print("❌ Erro: Arquivo não encontrado!")
    except ET.ParseError:
        print("❌ Erro: Arquivo XML inválido!")
    except Exception as e:
        print(f"❌ Erro: {str(e)}")

if __name__ == "__main__":
    main()
