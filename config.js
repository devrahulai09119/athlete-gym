/* Athlete Gym — single source for business settings.
   Replace temporary image files in place, or update this registry and the
   matching src attributes in index.html. Do not put secrets in this file. */
(function () {
  window.ATHLETE_CONFIG = {
    gymName: "Athlete Gym",
    location: "Sector 23, Gurgaon",
    enquiryEmail: "devrahul.ai09119@gmail.com",
    enquiryEndpoint: "/api/enquiry",
    /* Replace this placeholder with digits only, for example 9198XXXXXXXX.
       Do not include +, spaces, or dashes. */
    whatsappNumber: "WHATSAPP_NUMBER_HERE",
    /* Set when the production domain is known. Leave empty until then. */
    canonicalUrl: "",
    interests: [
      "Gym Membership",
      "Zumba",
      "Boxing",
      "Body Lifting",
      "Cardio",
      "Personal Training",
      "General Enquiry"
    ],
    whatsappMessages: {
      default:
        "Hello Athlete Gym, I am interested in joining the gym. I would like to know more about membership and training options.",
      membership:
        "Hello Athlete Gym, I am interested in gym membership. I would like to know more about membership options.",
      boxing:
        "Hello Athlete Gym, I am interested in Boxing training. I would like to know more about the sessions and membership options.",
      zumba:
        "Hello Athlete Gym, I am interested in Zumba. I would like to know more about the sessions and membership options.",
      cardio:
        "Hello Athlete Gym, I am interested in Cardio training. I would like to know more about the sessions and membership options.",
      lifting:
        "Hello Athlete Gym, I am interested in Body Lifting. I would like to know more about the sessions and membership options.",
      personal:
        "Hello Athlete Gym, I am interested in Personal Training. I would like to know more about coaching and membership options."
    },
    images: {
      hero: "assets/images/hero/hero.jpg",
      about: "assets/images/general/interior.jpg",
      zumba: "assets/images/zumba/zumba.jpg",
      boxing: "assets/images/boxing/boxing.jpg",
      lifting: "assets/images/strength/press.jpg",
      cardio: "assets/images/cardio/conditioning.jpg",
      personal: "assets/images/personal-training/coach.jpg",
      strength: "assets/images/strength/lift.jpg",
      barbell: "assets/images/strength/barbell.jpg",
      ropes: "assets/images/general/ropes.jpg",
      transformation: "assets/images/general/transformation.jpg"
    }
  };
})();
