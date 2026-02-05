export const games = [
  {
    id: "genesis-01",
    name: "Divine Reckoning",
    virtue: "CLARITY",
    description: "A high-performance algorithm visualizing the purification of chaos into order.",
    fullDescription: `# The Reckoning

Witness the unfolding of **Sacred Logic** as it traverses the void.

- **Order from Chaos**: See the sorting algorithms purify random data.
- **Speed of Light**: Optimized Wasm execution.
- **Divine Proportion**: Visuals based on the Golden Ratio.`,
    logicSnippet: `void purify_chaos(std::vector<int>& souls) {
    std::sort(souls.begin(), souls.end(), [](int a, int b) {
        return sacred_weight(a) < sacred_weight(b);
    });
}`,
    wasmPath: "#",
    previewImageUrl: "https://via.placeholder.com/800x500/000000/FFFFFF?text=DIVINE+RECKONING"
  },
  {
    id: "genesis-02",
    name: "Sanctuary of Silence",
    virtue: "TEMPERANCE",
    description: "A digital meditation space requiring absolute stillness of the cursor.",
    fullDescription: `# The Sanctuary

Enter the void of **Silence**.

> "Be still, and know."

This manifestation tracks your mouse movements. To progress, you must maintain absolute stillness.`,
    logicSnippet: `bool is_still(const InputState& state) {
    return state.velocity.magnitude() < EPSILON;
}`,
    wasmPath: "#",
    previewImageUrl: "https://via.placeholder.com/800x500/111111/FFFFFF?text=SANCTUARY"
  }
];
