import json
import uuid
import time

def get_id():
    return str(uuid.uuid4()).replace('-', '')[:16]

THEME = {
    "process": {"fill": "#fffbeb", "stroke": "#e67e22", "bg": "#fffbeb"},
    "datastore": {"fill": "#feebcf", "stroke": "#c05621", "bg": "#feebcf"},
    "external": {"fill": "#fff3dd", "stroke": "#a0522d", "bg": "#fff3dd"},
    "arrow": {"stroke": "#e67e22"},
    "text": "#4a2c2a"
}

elements = []

def create_text(x, y, text, group_id, width):
    text_id = get_id()
    # Approx width calculation: char * 9px (approx for size 16)
    # Excalidraw calculates this dynamically, we estimate.
    # Centered text.
    return {
        "id": text_id,
        "type": "text",
        "x": x + 10, # Padding
        "y": y + 20, # Padding
        "width": width - 20,
        "height": 20,
        "angle": 0,
        "strokeColor": THEME["text"],
        "backgroundColor": "transparent",
        "fillStyle": "hachure",
        "strokeWidth": 1,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [group_id],
        "strokeSharpness": "sharp",
        "seed": 123,
        "version": 1,
        "versionNonce": 0,
        "isDeleted": False,
        "boundElements": [],
        "updated": 1,
        "link": None,
        "locked": False,
        "text": text,
        "fontSize": 16,
        "fontFamily": 1,
        "textAlign": "center",
        "verticalAlign": "middle",
        "baseline": 18,
        "containerId": None,
        "originalText": text
    }

def create_shape(type_name, x, y, width, height, label, shape_type="rectangle"):
    group_id = get_id()
    shape_id = get_id()
    
    style = THEME.get(type_name, THEME["process"])
    
    text_el = create_text(x, y, label, group_id, width)
    text_el["containerId"] = shape_id
    
    shape = {
        "id": shape_id,
        "type": shape_type,
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "angle": 0,
        "strokeColor": style["stroke"],
        "backgroundColor": style["fill"],
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [group_id],
        "strokeSharpness": "round" if shape_type == "rectangle" else "sharp",
        "seed": 123,
        "version": 1,
        "versionNonce": 0,
        "isDeleted": False,
        "boundElements": [{"type": "text", "id": text_el["id"]}],
        "updated": 1,
        "link": None,
        "locked": False,
    }
    
    # Adjust text position to center
    # text_el["x"] = x + (width - text_el["width"]) / 2 # Simple center
    # text_el["y"] = y + (height - text_el["height"]) / 2
    
    elements.append(shape)
    elements.append(text_el)
    return shape_id

def create_arrow(start_id, end_id, label=None):
    arrow_id = get_id()
    
    # Find elements
    start_el = next(e for e in elements if e["id"] == start_id)
    end_el = next(e for e in elements if e["id"] == end_id)
    
    # Simple points (center to center approx)
    sx = start_el["x"] + start_el["width"]/2
    sy = start_el["y"] + start_el["height"]/2
    ex = end_el["x"] + end_el["width"]/2
    ey = end_el["y"] + end_el["height"]/2
    
    arrow = {
        "id": arrow_id,
        "type": "arrow",
        "x": sx,
        "y": sy,
        "width": ex - sx,
        "height": ey - sy,
        "angle": 0,
        "strokeColor": THEME["arrow"]["stroke"],
        "backgroundColor": "transparent",
        "fillStyle": "hachure",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "strokeSharpness": "round",
        "seed": 123,
        "version": 1,
        "versionNonce": 0,
        "isDeleted": False,
        "boundElements": [],
        "updated": 1,
        "link": None,
        "locked": False,
        "points": [[0, 0], [ex - sx, ey - sy]],
        "startBinding": {"elementId": start_id, "focus": 0, "gap": 10},
        "endBinding": {"elementId": end_id, "focus": 0, "gap": 10},
    }
    
    # Update bounds
    if "boundElements" not in start_el: start_el["boundElements"] = []
    start_el["boundElements"].append({"type": "arrow", "id": arrow_id})
    
    if "boundElements" not in end_el: end_el["boundElements"] = []
    end_el["boundElements"].append({"type": "arrow", "id": arrow_id})
    
    elements.append(arrow)
    
    if label:
        # Add text for arrow
        # Simplify: just place text near the middle point
        mx = sx + (ex - sx)/2
        my = sy + (ey - sy)/2
        # Text creation logic... skip for now to keep it simple, or add if critical.
        pass

# --- Build Diagram ---

# Entities
E1 = create_shape("external", 0, 100, 140, 80, "E1: Vendor")
E4 = create_shape("external", 0, 300, 140, 80, "E4: Supabase\nAuth")
E5 = create_shape("external", 200, 500, 140, 80, "E5: Cloudinary")

# Processes
P1 = create_shape("process", 200, 100, 140, 80, "1.0 Auth &\nProfile", "ellipse")
P2 = create_shape("process", 200, 300, 140, 80, "2.0 Menu\nMgmt", "ellipse")
P5 = create_shape("process", 400, -100, 140, 80, "5.0 Dashboard", "ellipse")

# Stores
D1 = create_shape("datastore", 400, 100, 140, 80, "D1: Vendors")
D2 = create_shape("datastore", 400, 300, 140, 80, "D2: Dishes")
D3 = create_shape("datastore", 400, 500, 140, 80, "D3: Updates")

# Analytics Store
D4 = create_shape("datastore", 600, 0, 140, 80, "D4: Menu\nEvents")

# Customer Side
P3 = create_shape("process", 600, 200, 140, 80, "3.0 Browse\nMenu", "ellipse")
P4 = create_shape("process", 600, 400, 140, 80, "4.0 Order\nCart", "ellipse")

E2 = create_shape("external", 800, 200, 140, 80, "E2: Customer")
E3 = create_shape("external", 800, 400, 140, 80, "E3: WhatsApp")

# Connections (Flows)
create_arrow(E1, P1, "Login")
create_arrow(E4, P1, "Token")
create_arrow(P1, D1, "Profile Data")

create_arrow(E1, P2, "Menu Data")
create_arrow(P2, D2, "Dish Details")
create_arrow(P2, E5, "Upload Media")
create_arrow(P2, D3, "Post Updates")

create_arrow(E2, P3, "Scan QR")
create_arrow(D1, P3, "Vendor Info")
create_arrow(D2, P3, "Dish Info")
create_arrow(D3, P3, "Stories")
create_arrow(P3, D4, "Log Views")

create_arrow(E2, P4, "Add to Cart")
create_arrow(D2, P4, "Price/Availability")
create_arrow(P4, D4, "Log Intent")
create_arrow(P4, E3, "Send Order")
create_arrow(P4, D4, "Log Order")

create_arrow(D4, P5, "Events")
create_arrow(P5, E1, "Metrics")


# Output
output = {
    "type": "excalidraw",
    "version": 2,
    "source": "https://excalidraw.com",
    "elements": elements,
    "appState": {
        "viewBackgroundColor": "#ffffff",
        "gridSize": 20
    },
    "files": {}
}

print(json.dumps(output, indent=2))
