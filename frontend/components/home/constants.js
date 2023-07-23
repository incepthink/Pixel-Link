export const heroParticleEffects = {
    fullScreen: {
      enable: false,
      zIndex: 0,
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: '#a4ded4',
      },
      links: {
        enable: true,
        color: '#36d1b7',
        distance: 150,
        opacity: 0.5,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: true,
        speed: 0.8,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
  }