function getPossibleMatches(rawSex, rawSexuality) {

    //Calculate all sexualties with all genders
    var allSexes = [];
    var allSexualities = [];
    const sexualities = JSON.parse(JSON.stringify(Sexuality));
    for (var key in sexualities) {
        allSexualities.push(sexualities[key]);
    }
    const sexes = JSON.parse(JSON.stringify(Sex));
    for (var key in sexes) {
        allSexes.push({
            sex: sexes[key],
            sexualities: allSexualities
        });
    }

    const sex = getSex(rawSex);
    const sexuality = getSexuality(rawSexuality);
    switch (sex) {
        case Sex.MALE:
            switch (sexuality) {
                case Sexuality.ASEXUAL:
                    return allSexes;
                case Sexuality.ANDROSEXUAL:
                    return [{
                        sex: Sex.MALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.BISEXUAL:
                    return [{
                        sex: Sex.MALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.ANDROSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }, {
                        sex: Sex.FEMALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HETEROSEXUAL, Sexuality.PANSEXUAL, Sexuality.ANDROSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.DEMISEXUAL:
                    return allSexes;
                case Sexuality.GYNOSEXUAL:
                    return [Sex.FEMALE];
                case Sexuality.HETEROSEXUAL:
                    return [Sex.FEMALE];
                case Sexuality.HOMOSEXUAL:
                    return [Sex.MALE];
                case Sexuality.PANSEXUAL:
                    return allSexes;
                case Sexuality.POLYSEXUAL:
                    return allSexes;
                case Sexuality.NOMASEXUAL:
                    return Object.keys(Sex).splice(allSexes.indexOf(Sex.MALE), 1);
                case Sexuality.NOWOMASEXUAL:
                    return Object.keys(Sex).splice(allSexes.indexOf(Sex.FEMALE), 1);
                case Sexuality.UNLABLED:
                    return allSexes;
                case Sexuality.SKOLIOSEXUAL:
                    return [Sex.NONBINARY];

            }
            break;

        case Sex.FEMALE:

            break;


    }
}


const Sexuality = {
    ASEXUAL: 'Asexuell',
    ANDROSEXUAL: 'Androsexuell',
    BISEXUAL: 'Bisexuell',
    DEMISEXUAL: 'Demisexuell',
    GYNOSEXUAL: 'Gynosexuell',
    HETEROSEXUAL: 'Heterosexuell',
    HOMOSEXUAL: 'Homosexuell',
    PANSEXUAL: 'Pansexuell',
    POLYSEXUAL: 'Polysexuell',
    NOMASEXUAL: 'Nomasexuell',
    NOWOMASEXUAL: 'Nowomasexuell',
    UNLABLED: 'Unlabled',
    SKOLIOSEXUAL: 'Skoliosexuell',
}

const Sex = {
    MALE: 'Männlich',
    FEMALE: 'Weiblich',
    INTERSEX: 'Intergeschlechtlich',
    GENDERFLUID: 'Genderfluid',
    TRANSGENDER: 'Transgender',
    BIGENDER: 'Bigender',
    NONBINARY: 'Non-Binary',
}

function getSexuality(str) {
    const sexualities = JSON.parse(JSON.stringify(Sexuality));
    for (var key in sexualities) {
        if (str.includes(sexualities[key])) {
            return sexualities[key];
        }
    }

    return null;
}

function getSex(str) {
    const sexes = JSON.parse(JSON.stringify(Sex));
    for (var key in sexes) {
        if (str.includes(sexes[key])) {
            return sexes[key];
        }
    }

    return null;

}

