import heroMarco from "../../MarcoSlideshow.webp";
import heroTrail from "../../cen.webp";
import heroRoad from "../../cropped.webp";
import schoolImage from "../../schul.webp";
import coachMarco from "../../tf.webp";
import coachBenjamin from "../../benj2.webp";

export const content = {
  brand: {
    name: "TPTraining",
    strap: "Train. Perform. Thrive."
  },
  hero: {
    kicker: "Alpine Velocity",
    title: ["Train.", "Perform.", "Thrive."],
    subtitle:
      "Individuelles Performance Coaching, Adventure Camps und Schule-Projekte mit einem klaren Weg von Technik zu Selbstvertrauen.",
    primaryCta: {
      label: "Angebote Entdecken",
      href: "#path"
    },
    secondaryCta: {
      label: "Schnellstart Check",
      href: "#conversion"
    },
    media: [
      {
        src: heroMarco,
        alt: "Athlet auf Bergstraße"
      },
      {
        src: heroTrail,
        alt: "Mountainbike Training auf Trail"
      },
      {
        src: heroRoad,
        alt: "Rennrad Training im Tal"
      }
    ],
    chips: ["Triathlon", "Mountainbike", "Schule / Projekt"],
    stats: [
      {
        value: "Adaptive",
        label: "Pläne passen sich Alltag und Niveau an"
      },
      {
        value: "Technik",
        label: "Sicherheit und Skills zuerst"
      },
      {
        value: "Community",
        label: "Camps mit Teamgeist in den Bergen"
      }
    ]
  },
  path: [
    {
      tag: "Ausdauer",
      title: "Triathlon Coaching",
      text: "Schwimmen, Bike und Lauf als ein smartes System mit klarer Progression.",
      image: heroRoad
    },
    {
      tag: "Trail",
      title: "MTB Skills",
      text: "Technik, Sicherheit und Speed auf Trails mit strukturierter Session-Logik.",
      image: heroTrail
    },
    {
      tag: "Nachwuchs",
      title: "Schule / Projekt",
      text: "Sportwochen und Projekttage mit altersgerechtem Aufbau und Spaßfaktor.",
      image: schoolImage
    }
  ],
  method: [
    {
      title: "Assess",
      text: "Start mit Zielbild, Ausgangsniveau und realem Wochenrhythmus."
    },
    {
      title: "Build",
      text: "Geplante Blöcke mit Technikfokus, Belastungssteuerung und Feedback." 
    },
    {
      title: "Perform",
      text: "Wettkampf- oder Camp-Phase mit Feinschliff und klaren nächsten Schritten."
    }
  ],
  programmes: [
    {
      id: "einsteiger",
      name: "Einsteiger",
      price: "ab EUR89 / Monat",
      tag: "Stabiler Start",
      text: "Für Athlet:innen, die mit klarer Struktur aufbauen wollen.",
      features: [
        "Monatliche Trainingsstruktur",
        "Technik-Fokus je nach Sportart",
        "Regelmäßige Plananpassung"
      ]
    },
    {
      id: "fortgeschritten",
      name: "Fortgeschritten",
      price: "ab EUR129 / Monat",
      tag: "Meistgewählt",
      featured: true,
      text: "Für regelmäßiges Training mit ambitionierten Zielen.",
      features: [
        "Enges Feedback und Anpassungen",
        "Leistungsorientierte Belastungssteuerung",
        "Wettkampf- oder Event-Vorbereitung"
      ]
    },
    {
      id: "pro-athlete",
      name: "Pro Athlete",
      price: "ab EUR169 / Monat",
      tag: "High Performance",
      text: "Für hohe Umfänge, Detailarbeit und maximalen Support.",
      features: [
        "Sehr enges Coaching-Intervall",
        "Feinsteuerung für Peak-Phasen",
        "Priorisierte Kommunikation"
      ]
    }
  ],
  coaches: [
    {
      id: "marco",
      name: "Marco Tiefenbacher",
      role: "Co-Founder & Triathlon Coach",
      image: coachMarco,
      highlights: [
        "Trainingsperiodisierung und Leistungstests",
        "Bike-Fitting und datenbasierte Trainingsplanung",
        "Triathlon-Übungsleiter seit 2024"
      ],
      story: [
        "Hallo zusammen, mein Name ist Marco Tiefenbacher, ich bin 18 Jahre alt und stamme aus dem wunderschönen Grafenstein. Mein sportlicher Werdegang ist zugegebenermaßen etwas verschlungen: Er begann mit einem Kinderschnuppertraining und führte mich in die Leichtathletik-Ausbildung beim LAC Klagenfurt.",
        "Dort spezialisierte ich mich nach einigen Saisonen als Mehrkämpfer auf die 1000 m- und 3000 m-Bahnrennen. Weil mir das monotone Kreislaufen irgendwann zu eintönig wurde, wechselte ich in den Berglauf, wo ich zwei Jahre lang unbezahlbare Erfahrungen und große Erfolge sammeln konnte.",
        "2022 brachte mich ein Freund zum Rennradsport - Liebe auf den ersten Tritt. Seitdem bin ich dem Radsport treu und wechselte im Sommer 2024 ganz auf zwei Räder.",
        "Im selben Jahr schloss ich erfolgreich meine Ausbildung zum Triathlon-Übungsleiter ab. Mein Herzensanliegen: jungen Menschen - vor allem Kindern - die Freude an Schwimmen, Radfahren und Laufen zu vermitteln und ihnen zu zeigen, wie viel Spaß diese Sportarten machen und welche Werte sie fürs Leben schenken."
      ]
    },
    {
      id: "benjamin",
      name: "Benjamin Pletzer",
      role: "Co-Founder & MTB Specialist",
      image: coachBenjamin,
      highlights: [
        "Trail-Skills und Nachwuchsförderung",
        "Techniktraining für Kinder und Erwachsene",
        "Aktiver Racer mit praktischer Wettkampferfahrung"
      ],
      story: [
        "Mein Name ist Benjamin Pletzer, ich bin 18 Jahre alt und seit vielen Jahren Leistungssportler im Mountainbike.",
        "Seit zwei Jahren arbeite ich in meiner Freizeit als Trainer - nicht nur mit Kindern, die Spaß auf dem Bike haben, sondern auch mit Erwachsenen, die ihre Freude am Rad erst später entdeckt haben. Ich darf meine Erfahrungen also an alle Altersgruppen weitergeben.",
        "Für mich ist Sport mehr als Bewegung: Er ist Leidenschaft, Disziplin und der ständige Wille, das Beste aus sich herauszuholen. Als aktiver Racer weiß ich genau, was es braucht, um Ziele nicht nur zu setzen, sondern auch zu erreichen - und dieses Wissen gebe ich eins-zu-eins weiter.",
        "Mein Ziel: der Jugend den Spaß am Fahrrad, insbesondere Mountainbike, näherzubringen und meine eigenen Erfahrungen bestmöglich weiterzugeben. Ich begleite dich auf deiner Reise zum erfahrenen Mountainbiker und zeige dir, wozu du wirklich fähig bist."
      ]
    }
  ],
  conversion: {
    title: "Bereit für deinen nächsten Schritt?",
    text:
      "Starte mit einem kurzen Schnellstart-Check. Du bekommst eine klare Empfehlung und den direktesten Weg zu deinem Ziel.",
    trust: [
      "Persönliche Beratung statt Standardplan",
      "Klare Struktur mit nachvollziehbarem Fortschritt",
      "Jugend- und einsteigerfreundlicher Einstieg"
    ],
    ctas: [
      {
        label: "Check Starten",
        href: "#booking"
      },
      {
        label: "Kontakt",
        href: "mailto:tp.training@gmx.net"
      }
    ]
  }
};
