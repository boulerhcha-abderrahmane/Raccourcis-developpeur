#!/usr/bin/env python3
"""
Script pour générer les icônes PNG de l'extension
Nécessite: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Erreur: Pillow n'est pas installé.")
    print("Installez-le avec: pip install Pillow")
    exit(1)

def create_icon(size):
    """Crée une icône PNG de la taille spécifiée"""
    # Créer une image avec fond transparent
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Couleurs du gradient
    color1 = (52, 152, 219)   # #3498db
    color2 = (41, 128, 185)   # #2980b9
    
    # Dessiner le fond avec coins arrondis
    radius = int(size * 0.15)
    
    # Créer un rectangle avec coins arrondis
    draw.rounded_rectangle(
        [(0, 0), (size, size)],
        radius=radius,
        fill=color1
    )
    
    # Ajouter un gradient simple (approximation)
    for y in range(size):
        ratio = y / size
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.rectangle([(0, y), (size, y+1)], fill=(r, g, b, 255))
    
    # Dessiner un symbole d'outil (simplifié)
    # Dessiner un carré blanc au centre
    center = size // 2
    symbol_size = size // 3
    offset = symbol_size // 2
    
    # Carré principal
    draw.rectangle(
        [(center - offset, center - offset),
         (center + offset, center + offset)],
        fill=(255, 255, 255, 255)
    )
    
    # Ligne horizontale
    draw.rectangle(
        [(center - offset, center - 2),
         (center + offset, center + 2)],
        fill=(52, 152, 219, 255)
    )
    
    # Ligne verticale
    draw.rectangle(
        [(center - 2, center - offset),
         (center + 2, center + offset)],
        fill=(52, 152, 219, 255)
    )
    
    # Sauvegarder
    os.makedirs('icons', exist_ok=True)
    filename = f'icons/icon{size}.png'
    img.save(filename, 'PNG')
    print(f'Icône créée: {filename}')

if __name__ == '__main__':
    print("Génération des icônes...")
    create_icon(16)
    create_icon(48)
    create_icon(128)
    print("\nToutes les icones ont ete generees avec succes!")

