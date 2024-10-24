// Select all elements with the class 'tooltip'
let tooltipElements = document.querySelectorAll(".tooltip");

tooltipElements.forEach((el) => {
  tippy(el, {
    content: el.getAttribute("data-tooltip"),
    delay: [600, 0],
    arrow: true,
    placement: "top",
    popperOptions: {
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: ["bottom", "right"],
          },
        },
        {
          name: "preventOverflow",
        },
      ],
    },
  });
});
