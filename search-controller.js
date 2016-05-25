function searchController(dataset) {

    this.dataset = dataset;
    this.matchedGlycopeptides = [];

    this.query = function (mass, ppm, ranges) {
        this.matchedGlycopeptides = [];
        var daTolerance = massConversion.ppmToDalton(mass,ppm);
        var minMass = +mass - daTolerance;
        var maxMass = +mass + daTolerance;
        var bucketMass = Math.round( mass * 10 );
        var minBucketMass = Math.round( minMass * 10 );
        var maxBucketMass = Math.round( maxMass * 10 );

        if (minBucketMass==maxBucketMass ){
            this.bucketSearch(bucketMass,minMass,maxMass);
        }else{
            this.bucketSearch(minBucketMass,minMass, maxMass);
            this.bucketSearch(maxBucketMass,minMass, maxMass);
            while (minBucketMass+1!=maxBucketMass){
                minBucketMass +=1;
                for(glycopeptide in dataset[minBucketMass]){
                    this.matchedGlycopeptides.push(dataset[minBucketMass][glycopeptide]);
                }
            }
        }
        return this.generateResponse(mass,ranges);
    };

    this.bucketSearch = function(bucket, minMass, maxMass){
        if(dataset[bucket]){
            for (var item in dataset[bucket]){
                if(this.checkMass(dataset[bucket][item][2], minMass, maxMass)){
                    this.matchedGlycopeptides.push(dataset[bucket][item]);
                }
            }
        }
    };

    this.checkMass = function(mass, min, max){
        if (min <= mass && mass <= max){
            return true;
        }else{
            return false;
        }
    };

    this.generateResponse = function (queryMass,ranges) {
        var peptideList = [];
        var glycanList = [];
        var glycopeptideMap = [];
        if(this.matchedGlycopeptides.length > 0) {
            var peptideCounter = 0;
            var glycanCounter = 0;
            this.matchedGlycopeptides.forEach(function (glycopeptide) {
                var peptide = glycopeptide[0];
                if(!validateGlycan(glycopeptide[1],ranges)){
                    return;
                }
                var glycan = glycopeptide[1].replace(":", "\:");
                var glycopeptideMass = glycopeptide[2];
                var peptideExists = this.contains(peptideList, peptide);
                var glycanExists = this.contains(glycanList, glycan);
                if(peptideExists!=-1){
                    peptideIdx = peptideExists;
                }else{
                    peptideCounter = peptideCounter+1;
                    peptideIdx = peptideCounter;
                    peptideList.push(peptide);
                }

                if(glycanExists!=-1){
                    glycanIdx = glycanExists;
                }else{
                    glycanCounter = glycanCounter+1;
                    glycanIdx = glycanCounter;
                    glycanList.push(glycan);
                }
                glycopeptideMap.push({'peptide': peptideIdx, 'glycan': glycanIdx, 'value': massConversion.daltonToPpm(queryMass, Math.abs(queryMass-glycopeptideMass)), 'mass': glycopeptideMass});
            })
        }
        return({'mass': queryMass, 'data': {'peptides': peptideList, 'glycans': glycanList, 'map': glycopeptideMap}});
    };

    contains = function (a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return i+1;
            }
        }
        return -1;
    };

    validateGlycan = function (glycanString,rangeList) {
        var glycan = createGlycan(glycanString);
        for(var range in rangeList){
            var minRange = Number(rangeList[range].minRange);
            var presence = Boolean(rangeList[range].presence);
            if(presence){   //Not possible in the range list.
                if(minRange > 0 && !glycan.hasOwnProperty(range) ){
                    return false;
                }
                if(minRange > 0 && minRange > glycan[range] ){
                    return false;
                }
            } else {
                if(glycan.hasOwnProperty(range)){
                    return false;
                }
            }
        }
        return true;
    };

    createGlycan = function (glycanString) {
     var tokens = glycanString.split("|");
        var glycan = { };
        tokens.forEach(function (item) {
            var monosaccharide = item.split(":");
            glycan[monosaccharide[0]] = monosaccharide[1];
        })
        return glycan;
    };
}

var massConversion = new function() {
    this.ppmToDalton = function(mass, ppm){
        return (mass*ppm)/1000000;
    }
    this.daltonToPpm = function(mass, da){
        return (da*1000000)/mass;
    }
}
