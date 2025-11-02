export type TbKash = {
  bKashLogo?: string;
  bKashNumber?: string;
};

export type TNagad = {
  nagadLogo?: string;
  nagadNumber?: string;
};

export type TRocket = {
  rocketLogo?: string;
  rocketNumber?: string;
};

export type TUpay = {
  upayLogo?: string;
  upayNumber?: string;
};

export type TSettings = {
  enableHomepagePopup: boolean;
  popupTitle?: string;
  popupDescription?: string;
  popupDelay?: number;
  popupImage?: string;

  logo?: string;
  sliderImages?: string[]; // max 3

  privacyPolicy?: {
    title: string;
    description: string;
  };
  returnPolicy?: {
    title: string;
    description: string;
  };

  deliveryCharge?: number;

  mobileMfs?: {
    bKash?: TbKash;
    nagad?: TNagad;
    rocket?: TRocket;
    upay?: TUpay;
  };

  contactAndSocial?: {
    address?: string;
    email?: string;
    phone?: string;
    facebookUrl?: string[];
    instagramUrl?: string[];
    youtubeUrl?: string[];
    whatsappLink?: string[];
  };
};
