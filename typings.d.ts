interface SanityBody {
    _createdAt: string;
    _id: string;
    _rev: string;
    _updatedAt: string;
}

interface Image {
    _type: 'image';
    asset: {
        _ref: string;
        _type: 'reference';
    };
}

export interface PageInfo extends SanityBody {
    _type: 'pageInfo';
    address: string;
    backgroundInformation: string;
    email: string;
    role: string;
    heroImage: Image;
    name: string;
    phoneNumber: string;
    profilePic: Image;
}

export interface Technology extends SanityBody {
    _type: 'technology';
    image: Image;
    progress: number;
    title: string;
}

export interface Skill extends SanityBody {
    _type: 'skill';
    image: Image;
    progress: number;
    title: string;
    /** NEW — groups skills for the resume's categorized skill lines. */
    category?:
        | 'Languages'
        | 'AI/ML'
        | 'Cloud & DevOps'
        | 'Databases'
        | 'Frontend'
        | 'Backend';
}

export interface Experience extends SanityBody {
    _type: 'experience';
    company: string;
    companyImage: Image;
    /** NEW — e.g. "San Francisco, CA" */
    location?: string;
    /** NEW — one-line role summary shown on the resume. */
    description?: string;
    dateStarted: string;
    dateEnded: string;
    isCurrentlyWorkingHere: boolean;
    jobTitle: string;
    points: string[];
    technologies: Technology[];
}

export interface Project extends SanityBody {
    _type: 'project';
    title: string;
    linkToBuild: string;
    image: Image;
    summary: string;
    /** NEW — bullets for the resume's "Projects & Outside Experience" section. */
    points?: string[];
    dateStarted?: string;
    dateEnded?: string;
    isOngoing?: boolean;
    order?: number;
    technologies: Technology[];
}

export interface Social extends SanityBody {
    _type: 'social';
    title: string;
    url: string;
}

export interface Certification extends SanityBody {
    _type: 'certification';
    title: string;
    issuer: string;
    /** Uploaded Sanity asset. */
    badgeImage?: Image;
    /** Or an issuer-hosted URL (e.g. Credly). One of the two should be set. */
    badgeImageUrl?: string;
    verifyUrl: string;
    credentialId?: string;
    dateIssued: string;
    /** Absent means the credential does not expire. */
    dateExpires?: string;
    featured?: boolean;
    skills?: string[];
}

/** NEW */
export interface Education extends SanityBody {
    _type: 'education';
    school: string;
    degree?: string;
    location?: string;
    dateStarted?: string;
    dateEnded?: string;
    points?: string[];
    order?: number;
}