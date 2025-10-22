# Pan Material Detection

The equipment detector now distinguishes between different pan materials for more accurate cleanup time estimates.

## Supported Pan Types

### 1. **Cast Iron Pan**
- **Base cleanup time**: 240 seconds (4 minutes)
- **Dishwasher safe**: ❌ No
- **Why longer**: Requires special care (no harsh soap traditionally), needs drying/oiling to prevent rust

**Detection patterns:**
- "cast iron pan", "cast iron skillet", "cast-iron pan"
- "iron skillet", "seasoned pan", "seasoned skillet"

**Example recipes:**
- Cornbread in cast iron skillet
- Cast iron seared steak
- Dutch baby pancake in seasoned pan

---

### 2. **Stainless Steel Pan**
- **Base cleanup time**: 200 seconds (3.3 minutes)
- **Dishwasher safe**: ✅ Yes
- **Why medium**: Food can stick, requires more scrubbing than nonstick, but dishwasher safe

**Detection patterns:**
- "stainless steel pan", "stainless pan", "stainless steel skillet"
- "steel pan", "steel skillet", "tri-ply pan", "clad pan"

**Example recipes:**
- Seared salmon in stainless pan
- Restaurant-style chicken in steel skillet
- Pan sauce in tri-ply pan

---

### 3. **Nonstick Pan**
- **Base cleanup time**: 120 seconds (2 minutes)
- **Dishwasher safe**: ✅ Yes (most modern ones)
- **Why fastest**: Food doesn't stick, wipes clean easily, minimal scrubbing

**Detection patterns:**
- "nonstick pan", "non-stick pan", "nonstick skillet"
- "teflon pan", "teflon skillet", "coated pan"

**Example recipes:**
- Scrambled eggs in nonstick pan
- Crepes in teflon skillet
- Fish fillets in coated pan

---

### 4. **Generic Frying Pan** (Fallback)
- **Base cleanup time**: 180 seconds (3 minutes)
- **Dishwasher safe**: ✅ Yes (assumed)
- **When used**: Material not specified in recipe

**Detection patterns:**
- "frying pan", "skillet", "fry pan", "sauté skillet"

**Example recipes:**
- "Heat a large skillet..."
- "In a frying pan, cook..."
- Any recipe without material specification

---

## How It Works

### Priority System

1. **Material-specific patterns checked first**
   - Cast iron, stainless steel, and nonstick patterns are processed before generic ones
   - Ensures "cast iron skillet" matches `cast_iron_pan`, not `frying_pan`

2. **Conflict resolution**
   - If both "cast iron skillet" and "skillet" are detected
   - System keeps only the more specific type (cast iron)
   - Prevents duplicate equipment entries

3. **Fallback to generic**
   - If recipe just says "heat a pan" or "use a skillet"
   - Defaults to generic `frying_pan` with moderate cleanup time
   - Reasonable estimate when material unknown

### Detection Examples

```javascript
// Recipe text: "Heat a cast iron skillet over medium heat"
// Detected: cast_iron_pan (240s, not dishwasher safe)
// NOT detected: frying_pan (prevented by conflict resolution)

// Recipe text: "Use a nonstick pan to cook the eggs"
// Detected: nonstick_pan (120s, dishwasher safe)

// Recipe text: "In a large skillet, sauté the vegetables"
// Detected: frying_pan (180s, default since material unknown)
```

---

## Cleanup Time Comparison

For the same recipe using different pans:

| Pan Type | Base Time | With Dishwasher | Without Dishwasher |
|----------|-----------|-----------------|---------------------|
| Nonstick | 2 min     | ~50s            | 2 min               |
| Generic  | 3 min     | ~1 min          | 3 min               |
| Stainless| 3.3 min   | ~1.2 min        | 3.3 min             |
| Cast Iron| 4 min     | 4 min (hand wash)| 4 min              |

*Times shown are base estimates before complexity modifiers*

---

## Impact on Estimates

### Material matters!

Same recipe, different results based on pan type:

**Example: Fried Eggs**

- **Nonstick pan**: 2 min base → With dishwasher: ~50s ✅
- **Cast iron**: 4 min base → Hand wash only: 4 min + oil maintenance

**Difference**: 3+ minutes of cleanup time just from pan choice!

---

## Future Enhancements

### Potential additions:

1. **Copper pans** (high-maintenance, beautiful finish)
2. **Carbon steel** (similar to cast iron, needs seasoning)
3. **Ceramic coated** (medium cleanup, no teflon)
4. **Anodized aluminum** (nonstick-ish, dishwasher varies)

See `FUTURE_IMPROVEMENTS.md` for full roadmap.

---

## Testing & Verification

Each detection includes source citation showing WHERE in the recipe the pan was mentioned:

```
Found in recipe: "...heat a cast iron skillet over medium heat..."
```

This makes it easy to verify detection accuracy and catch false positives.

---

**Last Updated**: 2025-10-21
**Feature Status**: ✅ Deployed to production
