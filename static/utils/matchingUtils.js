function getPossibleMatches(rawGender, rawSexuality) {

    //Calculate all sexualties with all genders
    var allGenders = [];
    var allSexualities = [];
    const sexualities = JSON.parse(JSON.stringify(Sexuality));
    for (var key in sexualities) {
        allSexualities.push(sexualities[key]);
    }
    const genders = JSON.parse(JSON.stringify(Gender));
    for (var key in genders) {
        allGenders.push({
            sex: genders[key],
            sexualities: allSexualities
        });
    }

    const gender = getGender(rawGender);
    const sexuality = getSexuality(rawSexuality);

    //Set possible matching partners where to this profile is shown
    switch (gender) {
        case Gender.MALE:
            switch (sexuality) {
                case Sexuality.ASEXUAL:
                    return removeSexuality(allGenders, Sexuality.NOMASEXUAL, Sexuality.GYNOSEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.ANDROSEXUAL:
                    return [{
                        sex: Gender.MALE,
                        sexualities: [Sexuality.ANDROSEXUAL, Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.BISEXUAL:
                    return [{
                        sex: Gender.MALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.ANDROSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }, {
                        sex: Gender.FEMALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HETEROSEXUAL, Sexuality.PANSEXUAL, Sexuality.ANDROSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.DEMISEXUAL:
                    return removeSexuality(allGenders, Sexuality.NOMASEXUAL, Sexuality.GYNOSEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.GYNOSEXUAL:
                    return [{
                        sex: Gender.FEMALE,
                        sexualities: [Sexuality.ANDROSEXUAL, Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HETEROSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.HETEROSEXUAL:
                    return [{
                        sex: Gender.FEMALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HETEROSEXUAL, Sexuality.PANSEXUAL, Sexuality.ANDROSEXUAL, Sexuality.POLYSEXUAL, Sexuality.UNLABLED]
                    }]
                case Sexuality.HOMOSEXUAL:
                    return [{
                        sex: Gender.MALE,
                        sexualities: [Sexuality.ANDROSEXUAL, Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }]
                case Sexuality.PANSEXUAL:
                    return removeSexuality(allGenders, Sexuality.NOMASEXUAL, Sexuality.GYNOSEXUAL, Sexuality.SKOLIOSEXUAL);
                    ;
                case Sexuality.POLYSEXUAL:
                    return removeSexuality(allGenders, Sexuality.NOMASEXUAL, Sexuality.GYNOSEXUAL, Sexuality.SKOLIOSEXUAL);
                    ;
                case Sexuality.NOMASEXUAL:
                    return removeSexuality(removeGender(allGenders, Gender.MALE), Sexuality.GYNOSEXUAL, Sexuality.NOMASEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.NOWOMASEXUAL:
                    return removeSexuality(removeGender(allGenders, Gender.FEMALE), Sexuality.GYNOSEXUAL, Sexuality.NOMASEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.UNLABLED:
                    return removeSexuality(allGenders, Sexuality.GYNOSEXUAL, Sexuality.NOMASEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.SKOLIOSEXUAL:
                    return [{
                        sex: Gender.NONBINARY,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.ANDROSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];
            }
            break;

        case Gender.FEMALE:
            switch (sexuality) {
                case Sexuality.ASEXUAL:
                    return removeSexuality(allGenders, Sexuality.NOWOMASEXUAL, Sexuality.ANDROSEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.ANDROSEXUAL:
                    return [{
                        sex: Gender.MALE,
                        sexualities: [Sexuality.GYNOSEXUAL, Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.BISEXUAL:
                    return [{
                        sex: Gender.MALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HETEROSEXUAL, Sexuality.GYNOSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.UNLABLED]
                    }, {
                        sex: Gender.FEMALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.PANSEXUAL, Sexuality.GYNOSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.DEMISEXUAL:
                    return removeSexuality(allGenders, Sexuality.NOWOMASEXUAL, Sexuality.ANDROSEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.GYNOSEXUAL:
                    return [{
                        sex: Gender.FEMALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.HETEROSEXUAL:
                    return [{
                        sex: Gender.MALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.HETEROSEXUAL, Sexuality.PANSEXUAL, Sexuality.GYNOSEXUAL, Sexuality.POLYSEXUAL, Sexuality.UNLABLED]
                    }]
                case Sexuality.HOMOSEXUAL:
                    return [{
                        sex: Gender.FEMALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.GYNOSEXUAL, Sexuality.BISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.UNLABLED]
                    }]
                case Sexuality.PANSEXUAL:
                    return removeSexuality(allGenders, Sexuality.NOWOMASEXUAL, Sexuality.ANDROSEXUAL, Sexuality.SKOLIOSEXUAL);
                    ;
                case Sexuality.POLYSEXUAL:
                    return removeSexuality(allGenders, Sexuality.NOWOMASEXUAL, Sexuality.ANDROSEXUAL, Sexuality.SKOLIOSEXUAL);
                    ;
                case Sexuality.NOMASEXUAL:
                    return removeSexuality(removeGender(allGenders, Gender.MALE), Sexuality.NOWOMASEXUAL, Sexuality.ANDROSEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.NOWOMASEXUAL:
                    return removeSexuality(removeGender(allGenders, Gender.FEMALE), Sexuality.NOWOMASEXUAL, Sexuality.ANDROSEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.UNLABLED:
                    return removeSexuality(allGenders, Sexuality.NOWOMASEXUAL, Sexuality.ANDROSEXUAL, Sexuality.SKOLIOSEXUAL);
                case Sexuality.SKOLIOSEXUAL:
                    return [{
                        sex: Gender.NONBINARY,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.BISEXUAL, Sexuality.GYNOSEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.UNLABLED]
                    }];
            }
            break;

        case Gender.INTERSEX:
            switch(sexuality) {
                case Sexuality.ASEXUAL:
                    return removeSexuality(allGenders, Sexuality.SKOLIOSEXUAL);
                case Sexuality.ANDROSEXUAL:
                    return [{
                        sex: Gender.MALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.BISEXUAL:
                    return [{
                        sex: Gender.MALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }, {
                        sex: Gender.FEMALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];
                case Sexuality.GYNOSEXUAL:
                    return [{
                        sex: Gender.FEMALE,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.DEMISEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];

                case Sexuality.DEMISEXUAL:
                    return removeSexuality(allGenders, Sexuality.ANDROSEXUAL, Sexuality.GYNOSEXUAL, Sexuality.BISEXUAL, Sexuality.HETEROSEXUAL, Sexuality.HOMOSEXUAL);

                case Sexuality.HETEROSEXUAL:
                    return removeSexuality(allGenders, Sexuality.ANDROSEXUAL, Sexuality.GYNOSEXUAL, Sexuality.BISEXUAL, Sexuality.HETEROSEXUAL, Sexuality.HOMOSEXUAL);

                case Sexuality.HOMOSEXUAL:
                    return [{
                        sex: Gender.INTERSEX,
                        sexualities: [Sexuality.ASEXUAL, Sexuality.DEMISEXUAL, Sexuality.HOMOSEXUAL, Sexuality.PANSEXUAL, Sexuality.POLYSEXUAL, Sexuality.NOMASEXUAL, Sexuality.NOWOMASEXUAL, Sexuality.UNLABLED]
                    }];

                case Sexuality.PANSEXUAL:
            }
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

const Gender = {
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

function getGender(str) {
    const genders = JSON.parse(JSON.stringify(Gender));
    for (var key in genders) {
        if (str.includes(genders[key])) {
            return genders[key];
        }
    }

    return null;

}

function removeGender(arr, ...gender) {
    for (var i = 0; i < arr.length; i++) {
        var obj = JSON.parse(JSON.stringify(arr[i]));
        if (gender.includes(obj.sex)) {
            arr.splice(i, 1);
        }
    }

    return arr;

}

function removeSexuality(arr, ...sexuality) {
    console.log(arr);
    console.log(sexuality);
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        var obj = JSON.parse(JSON.stringify(arr[i]));
        for (var j = 0; j < obj.sexualities.length; j++) {
            if (sexuality.includes(obj.sexualities[j])) {
                obj.sexualities.splice(j, 1);
            }
        }

        arr[i] = obj;
    }

    return arr;

}
