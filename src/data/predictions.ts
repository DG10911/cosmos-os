export type Prediction = {
  id: string;
  text: string;
  category: string;
  by: string;
  astrologerId: number;
  madeOn: string;
  dueOn: string;
  status: "open" | "yes" | "no" | "partial";
};

export const PREDICTIONS: Prediction[] = [
  {
    id: "p1",
    text: "You'll get clarity on the promotion",
    category: "Career",
    by: "Pt. Suresh Sharma",
    astrologerId: 1,
    madeOn: "8 Aug 2026",
    dueOn: "22 Nov 2026",
    status: "open",
  },
  {
    id: "p2",
    text: "A short trip brings an unexpected opportunity",
    category: "Travel",
    by: "Acharya Deepa Iyer",
    astrologerId: 2,
    madeOn: "2 Jul 2026",
    dueOn: "15 Sep 2026",
    status: "open",
  },
  {
    id: "p3",
    text: "The conflict with your manager resolves",
    category: "Career",
    by: "Pt. Suresh Sharma",
    astrologerId: 1,
    madeOn: "12 Jun 2026",
    dueOn: "1 Aug 2026",
    status: "yes",
  },
  {
    id: "p4",
    text: "A financial decision should be delayed 6 weeks",
    category: "Finance",
    by: "Guruji Anand Bhargav",
    astrologerId: 5,
    madeOn: "20 May 2026",
    dueOn: "1 Jul 2026",
    status: "yes",
  },
  {
    id: "p5",
    text: "A new friendship blossoms this spring",
    category: "Love",
    by: "Rohit Malhotra",
    astrologerId: 3,
    madeOn: "3 Feb 2026",
    dueOn: "30 Apr 2026",
    status: "partial",
  },
];
