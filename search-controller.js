function searchController(dataset) {

    this.dataset = dataset;
    this.matchedGlycopeptides = [];

    this.query = function (mass, ppm) {
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
        return this.generateResponse(mass);
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

    this.generateResponse = function (queryMass) {
        var peptideList = [];
        var glycanList = [];
        var glycopeptideMap = [];
        if(this.matchedGlycopeptides.length > 0) {
            var peptideCounter = 0;
            var glycanCounter = 0;
            console.log(this.matchedGlycopeptides);
            this.matchedGlycopeptides.forEach(function (glycopeptide) {
                console.log(glycopeptide);
                var peptide = glycopeptide[0];
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
                glycopeptideMap.push({'peptide': peptideIdx, 'glycan': glycanIdx, 'value': this.massConversion.daltonToPpm(queryMass, Math.abs(queryMass-glycopeptideMass)), 'mass': glycopeptideMass});
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
}

var massConversion = new function() {
    this.ppmToDalton = function(mass, ppm){
        return (mass*ppm)/1000000;
    }
    this.daltonToPpm = function(mass, da){
        return (da*1000000)/mass;
    }
}
